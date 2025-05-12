import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { ulid } from "ulid";

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

    try {
      // delete user cart
      await prisma.cart.delete({
        where: {
          userId,
        },
      });
    } catch (error) {
      console.log("Error deleting cart");
    }

    allOrders.forEach(async (order) => {
      // update product quantity
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

      // const options = {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${process.env.SHIPROCKET_API_KEY}`,
      //   },
      //   body: JSON.stringify({
      //     order_id: order.id,
      //     order_date: order.createdAt,
      //     pickup_location: "warehouse",
      //     billing_customer_name: order.address.firstName,
      //     billing_last_name: order.address.lastName,
      //     billing_address: order.address.address1,
      //     billing_address_2: order.address.address2,
      //     billing_city: "Bangalore",
      //     billing_pincode: order.address.zipcode,
      //     billing_state: order.address.state,
      //     billing_country: "India",
      //     billing_email: order.address.email,
      //     billing_phone: order.address.phone,
      //     shipping_is_billing: true,
      //     order_items: [
      //       {
      //         name: order.product.title,
      //         sku: order.product.id,
      //         units: order.quantity,
      //         selling_price: order.product.price,
      //       },
      //     ],
      //     payment_method: "Prepaid",
      //     sub_total: order.price,
      //     length: order.product.length,
      //     breadth: order.product.breadth,
      //     height: order.product.height,
      //     weight: order.product.weight,
      //   }),
      // };
      // const createShipRocketOrder = await fetch(
      //   "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
      //   options
      // );
      // const data: { order_id: number; shipment_id: number } =
      //   await createShipRocketOrder.json();
      // console.log(data.shipment_id, data.order_id);

      // await fetch("https://apiv2.shiprocket.in/v1/external/courier/assign/awb", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${process.env.SHIPROCKET_API_KEY}`,
      //   },
      //   body: JSON.stringify({
      //     shipment_id: data.shipment_id,
      //     courier_id: "10",
      //   }),
      // });
      // const awbRes = await createAWB.json();
      await prisma.activity.create({
        data: {
          userId,
          type: "order",
          title: `Order Placed ${order.product.title}`,
          id: ulid(),
        },
      });
    });
  } catch (error) {}
  return NextResponse.json({ status: "ok" }, { status: 200 });
}
