import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { nanoid } from "nanoid";

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
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
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
          id: nanoid(12),
        },
      });
    });

    // Get Time to Deliver
    const getTTD = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/pincode?pincode=${allOrders[0].address.zipcode}`
    );
    const data = await getTTD.json();

    if (!data.success) {
      return;
    }

    const totalWeight = allOrders.reduce((acc, order) => {
      return acc + order.product.weight;
    }, 0);

    // Calculate Shipping Cost
    const getShippingCost = await fetch(
      `https://track.delhivery.com/api/kinko/v1/invoice/charges/.json?md=E&ss=DTO&d_pin=${allOrders[0].address.zipcode}&o_pin=560078&cgm=${totalWeight}&pt=Pre-paid&payment_mode=Wallet`,
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
              phone: allOrders[0].user.phone,
              add:
                allOrders[0].address.address1 +
                ", " +
                allOrders[0].address.address2,
              pin: allOrders[0].address.zipcode,
            },
          ],
          pickup_location: {
            name: "mahaveer-sitara",
          },
        }),
      }
    );
    const createShipmentData = await createShipment.json();

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
          pickup_time: "11:00:00",
          pickup_date: "2023-12-29",
          pickup_location: "mahaveer-sitara",
          expected_package_count: 1,
        }),
      }
    );
    const createPickupRequestData = await createPickupRequest.json();

    // Generate Shipping Label
    const generateShippingLabel = await fetch(
      `https://track.delhivery.com/api/p/packing_slip?wbns=${"waybill"}&pdf=true&pdf_size=4R`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: process.env.DELHIVERY_TOKEN!,
        },
      }
    );
    const generateShippingLabelData = await generateShippingLabel.json();
  } catch (error) {
    console.log(error);
  }
  return NextResponse.json({ status: "ok" }, { status: 200 });
}
