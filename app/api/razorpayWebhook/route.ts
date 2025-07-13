import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";
import ShortUniqueId from "short-unique-id";
const { randomUUID } = new ShortUniqueId({ length: 12 });
import nodemailer from "nodemailer";
import { render } from "@react-email/components";
import OrderConfirmationEmail from "@/components/email-templates/order-receipt";
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
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    // update order
    await prisma.order.updateMany({
      where: {
        rzpOrderId: orderId,
      },
      data: {
        paymentId,
        paymentSuccess: true,
      },
    });

    const allOrders = await prisma.order.findMany({
      where: {
        rzpOrderId: orderId,
      },
      include: {
        user: true,
        address: true,
        product: true,
      },
    });
    const userId = allOrders[0].userId;

    // delete user cart
    try {
      await prisma.cart.delete({
        where: {
          userId,
        },
      });
    } catch (error) {
      console.log("Error deleting cart");
    }

    const zipcode = allOrders[0].address.zipcode;

    // update product quantity
    allOrders.forEach(async (order) => {
      const updateQuantity = await prisma.quantity.update({
        where: {
          productId: order.productId,
        },
        data: {
          sm: {
            decrement: order.size == "sm" ? order.quantity : 0,
          },
          md: {
            decrement: order.size == "md" ? order.quantity : 0,
          },
          lg: {
            decrement: order.size == "lg" ? order.quantity : 0,
          },
          xl: {
            decrement: order.size == "xl" ? order.quantity : 0,
          },
          doublexl: {
            decrement: order.size == "doublexl" ? order.quantity : 0,
          },
        },
      });
      console.log(updateQuantity, "Updated Quantity");

      await prisma.activity.create({
        data: {
          userId,
          type: "order",
          title: `Order Placed ${order.product.title}`,
          id: randomUUID(),
        },
      });
    });

    // Get Time to Deliver
    const getTTD = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/pincode?pincode=${zipcode}`
    );
    const ttdData = await getTTD.json();
    const ttd = ttdData.ttd;

    const indianNow = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );

    const deliveryDate = new Date(indianNow);
    deliveryDate.setDate(deliveryDate.getDate() + ttd);

    console.log(deliveryDate);

    const totalWeight = allOrders.reduce((acc, order) => {
      return acc + order.product.weight;
    }, 0);

    const totalHeight = allOrders.reduce((acc, order) => {
      return acc + order.product.height;
    }, 0);

    const totalLength = allOrders.reduce((acc, order) => {
      return acc + order.product.length;
    }, 0);

    const totalWidth = allOrders.reduce((acc, order) => {
      return acc + order.product.breadth;
    }, 0);

    const totalAmount = allOrders.reduce((acc, order) => {
      return acc + order.product.price;
    }, 0);

    // Calculate Shipping Cost
    const getShippingCost = await fetch(
      `https://track.delhivery.com/api/kinko/v1/invoice/charges/.json?md=E&ss=DTO&d_pin=${zipcode}&o_pin=560078&cgm=${totalWeight}&pt=Pre-paid`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: process.env.DELHIVERY_TOKEN!,
        },
      }
    );
    const shippingCostData = await getShippingCost.json();
    const shippingCost = shippingCostData[0].total_amount;
    console.log(shippingCost);

    // Create Shipment
    const createShipment = await fetch(
      "https://staging-express.delhivery.com/api/cmu/create.json",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: process.env.DELHIVERY_TOKEN!,
        },
        body: JSON.stringify({
          shipments: [
            {
              name: allOrders[0].user.name,
              order: orderId,
              phone: allOrders[0].user.phoneNumber!,
              add: `${allOrders[0].address.address1}, ${allOrders[0].address.address2}`,
              pin: zipcode,
              payment_mode: "Prepaid",
              weight: totalWeight,
              shipment_height: totalHeight,
              shipment_length: totalLength,
              shipment_width: totalWidth,
            },
          ],
          pickup_location: {
            name: "mahaveer-sitara",
          },
        }),
      }
    );
    const createShipmentData = await createShipment.json();
    const waybill = createShipmentData.upload_wbn;
    console.log(waybill);
    // if (!createShipmentData.success) {
    //   return NextResponse.json(
    //     { status: "Failed to create shipment" },
    //     { status: 400 }
    //   );
    // }

    function getNextIndianDate(): string {
      const indiaTime = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
      });
      const date = new Date(indiaTime);

      date.setDate(date.getDate() + 1);

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    }

    // Create Pickup Request
    const createPickupRequest = await fetch(
      "https://track.delhivery.com/fm/request/new/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: process.env.DELHIVERY_TOKEN!,
        },
        body: JSON.stringify({
          pickup_time: "10:00:00",
          pickup_date: getNextIndianDate(),
          pickup_location: "mahaveer-sitara",
          expected_package_count: 1,
        }),
      }
    );
    const createPickupRequestData = await createPickupRequest.json();
    const pickupId = createPickupRequestData.pickup_id;
    const pickupTime = createPickupRequestData.pickup_time;
    const pickupDate = createPickupRequestData.pickup_date;

    // Generate Shipping Label
    const generateShippingLabel = await fetch(
      `https://track.delhivery.com/api/p/packing_slip?wbns=${waybill}&pdf=true&pdf_size=4R`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: process.env.DELHIVERY_TOKEN!,
        },
      }
    );
    const generateShippingLabelData = await generateShippingLabel.json();
    // const shippingLabel = generateShippingLabelData.packages[0].url;
    const shippingLabel = "s3.aira.in";
    // if (!shippingLabel) {
    //   return NextResponse.json(
    //     { status: "Could not generate shipping label" },
    //     { status: 400 }
    //   );
    // }

    // Update Order
    await prisma.order.updateMany({
      where: {
        rzpOrderId: orderId,
      },
      data: {
        ttd: deliveryDate,
        waybill,
        pickupId,
        pickupTime,
        pickupDate,
        shipmentCost: shippingCost,
        shippingLabel,
      },
    });

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
        awbNumber: waybill ?? "GHHRWQNVPOGNWSZ",
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

    const response = await fetch(
      `https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_NUMBER}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${process.env.WHATSAPP_CLOUD_API_KEY}`,
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: `+91${allOrders[0].user.phoneNumber}`,
          type: "template",
          template: {
            name: "order_confirmed",
            language: {
              code: "en_US",
            },
            components: [
              {
                type: "header",
                parameters: [
                  {
                    type: "image",
                    image: {
                      link: allOrders[0].product.images[0],
                    },
                  },
                ],
              },
              {
                type: "body",
                parameters: [
                  {
                    type: "text",
                    text: allOrders[0].address.firstName,
                  },
                  {
                    type: "text",
                    text: `${allOrders[0].id}`,
                  },
                  {
                    type: "text",
                    text: `${formatCurrency(totalAmount)}`,
                  },
                  // {
                  //   type: "text",
                  //   text: `${deliveryDate.toLocaleDateString("en-US", {
                  //     day: "numeric",
                  //     month: "long",
                  //   })}`,
                  // },
                  // {
                  //   type: "text",
                  //   text: `${waybill ?? "GHHRWQNVPOGNWSZ"}`,
                  // },
                ],
              },
            ],
          },
        }),
      }
    );
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { status: "error", error: error },
      { status: 400 }
    );
  }
  return NextResponse.json({ status: "ok" }, { status: 200 });
}
