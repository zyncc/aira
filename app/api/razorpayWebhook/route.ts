import prisma from "@/lib/prisma";
import crypto from "crypto";
import { NextResponse } from "next/server";
import ShortUniqueId from "short-unique-id";
const { randomUUID } = new ShortUniqueId({ length: 12 });
import nodemailer from "nodemailer";
import { render } from "@react-email/components";
import OrderConfirmationEmail from "@/components/email-templates/order-receipt";
import { getCloudinaryImageUrl } from "@/lib/getCloudinaryThumbnailUrl";
import formatCurrency from "@/lib/formatCurrency";

export async function POST(req: Request) {
  const rzp_response = await req.json();
  const paymentId = rzp_response.payload.payment.entity.id;
  const orderId = rzp_response.payload.payment.entity.order_id;
  const razorpaySignature = req.headers.get("x-razorpay-signature");

  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(JSON.stringify(rzp_response))
    .digest("hex");

  if (generatedSignature !== razorpaySignature) {
    return NextResponse.json({ error: "Forbidden" }, { status: 401 });
  }

  // ✅ Update payment success for all orders
  await prisma.order.updateMany({
    where: {
      rzpOrderId: orderId,
    },
    data: { paymentId, paymentSuccess: true },
  });

  const allOrders = await prisma.order.findMany({
    where: {
      rzpOrderId: orderId,
    },
    include: { user: true, address: true, product: true },
  });

  const user = allOrders[0].user;
  const address = allOrders[0].address;
  const zipcode = address.zipcode;
  const userId = user.id;

  // ✅ Delete user cart (single call)
  try {
    await prisma.cart.delete({
      where: {
        userId,
      },
    });
  } catch (error) {
    console.log("Error deleting cart");
  }

  // ✅ Bulk quantity update (parallel)
  const quantityUpdates = allOrders.map((o) => {
    return prisma.quantity.update({
      where: {
        productId: o.productId,
      },
      data: {
        sm: {
          decrement: o.size === "sm" ? o.quantity : 0,
        },
        md: {
          decrement: o.size === "md" ? o.quantity : 0,
        },
        lg: {
          decrement: o.size === "lg" ? o.quantity : 0,
        },
        xl: {
          decrement: o.size === "xl" ? o.quantity : 0,
        },
        doublexl: {
          decrement: o.size === "doublexl" ? o.quantity : 0,
        },
      },
    });
  });

  // ✅ Create activity logs (parallel)
  const activityLogs = allOrders.map((o) => {
    return prisma.activity.create({
      data: {
        id: randomUUID(),
        type: "order",
        title: `Order Placed ${o.product.title}`,
        userId: userId,
      },
    });
  });

  await Promise.all([...quantityUpdates, ...activityLogs]);

  // ✅ Get delivery time
  const ttdData = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/pincode?pincode=${zipcode}`
  ).then((res) => res.json());
  const deliveryDate = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );
  deliveryDate.setDate(deliveryDate.getDate() + ttdData.ttd + 2);

  // ✅ Aggregate product data
  const totalWeight = allOrders.reduce((acc, o) => acc + o.product.weight, 0);
  const totalHeight = allOrders.reduce((acc, o) => acc + o.product.height, 0);
  const totalLength = allOrders.reduce((acc, o) => acc + o.product.length, 0);
  const totalWidth = allOrders.reduce((acc, o) => acc + o.product.breadth, 0);
  const totalAmount = allOrders.reduce((acc, o) => acc + o.product.price, 0);

  // ✅ Get shipping cost
  const shippingCostData = await fetch(
    `https://track.delhivery.com/api/kinko/v1/invoice/charges/.json?md=E&ss=DTO&d_pin=${zipcode}&o_pin=560078&cgm=${totalWeight}&pt=Pre-paid`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.DELHIVERY_TOKEN!,
      },
    }
  ).then((res) => res.json());

  const shippingCost = shippingCostData[0]?.total_amount;

  // ✅ Create shipment
  const shipmentData = {
    shipments: [
      {
        name: user.name,
        order: orderId,
        phone: address.phone,
        add: `${address.address1}, ${address.address2}`,
        pin: zipcode,
        payment_mode: "Prepaid",
        weight: totalWeight,
        shipment_height: totalHeight,
        shipment_length: totalLength,
        shipment_width: totalWidth,
      },
    ],
    pickup_location: { name: "mahaveer-sitara" },
  };

  const formBody = new URLSearchParams({
    format: "json",
    data: JSON.stringify(shipmentData),
  });

  const createShipment = await fetch(
    "https://track.delhivery.com/api/cmu/create.json",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        Authorization: process.env.DELHIVERY_TOKEN!,
      },
      body: formBody,
    }
  ).then((res) => res.json());

  const waybill = createShipment.packages?.[0]?.waybill;
  const shippingLabelRes = await fetch(
    `https://track.delhivery.com/api/p/packing_slip?wbns=${waybill}&pdf=true&pdf_size=4R`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.DELHIVERY_TOKEN!,
      },
    }
  ).then((res) => res.json());

  const shippingLabel = shippingLabelRes.packages?.[0]?.pdf_download_link;

  // ✅ Update all orders (bulk update if schema allows)
  await prisma.order.updateMany({
    where: {
      rzpOrderId: orderId,
    },
    data: {
      ttd: deliveryDate,
      shipmentCost: shippingCost,
      waybill,
      shippingLabel,
    },
  });

  // ✅ Send Email
  const transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 465,
    secure: true,
    auth: {
      user: "support@airaclothing.in",
      pass: process.env.SMTP_PASSWORD,
    },
  });
  const emailHtml = await render(
    OrderConfirmationEmail({
      customerName: allOrders[0].user.name!,
      orderId,
      awbNumber: waybill,
      paymentId,
      orders: allOrders,
      shippingAddress: allOrders[0].address,
      orderDate: new Date().toISOString(),
      totalAmount: totalAmount,
      ttd: deliveryDate,
    })
  );

  const options = {
    from: "Aira <support@airaclothing.in>",
    to: allOrders[0].user.email!,
    subject: "Order Confirmation",
    html: emailHtml,
  };

  const sendEmail = await transporter.sendMail(options);
  console.log(sendEmail.accepted);

  // ✅ Prepare WhatsApp messages (parallel)
  const commonParams = [
    {
      type: "header",
      parameters: [
        {
          type: "image",
          image: {
            link: getCloudinaryImageUrl(allOrders[0].product.images[0]),
          },
        },
      ],
    },
    {
      type: "body",
      parameters: [
        { type: "text", text: address.firstName },
        { type: "text", text: `${allOrders[0].id}` },
        { type: "text", text: `${formatCurrency(totalAmount)}` },
      ],
    },
  ];

  const numbers = [user.phoneNumber, "9448093950", "9148106357"].map(
    (n) => `+91${n}`
  );
  const whatsappMessages = numbers.map((number) =>
    fetch(
      `https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_NUMBER}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${process.env.WHATSAPP_CLOUD_API_KEY}`,
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: number,
          type: "template",
          template: {
            name: "order_confirmed",
            language: { code: "en_US" },
            components: commonParams,
          },
        }),
      }
    )
  );

  const whatsappResponses = await Promise.all(whatsappMessages);
  whatsappResponses.forEach((res, i) =>
    console.log(`Message ${i + 1} OK: `, res.ok)
  );

  return NextResponse.json({ status: "ok" }, { status: 200 });
}
