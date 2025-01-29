import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";

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

  allOrders.forEach(async (order) => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SHIPROCKET_API_KEY}`,
      },
      body: JSON.stringify({
        order_id: order.id,
        order_date: order.createdAt,
        pickup_location: "Bangalore",
        billing_customer_name: order.address.name,
        billing_address: order.address.address1,
        billing_address_2: order.address.address2,
        billing_city: "Bangalore",
        billing_pincode: order.address.zipcode,
        billing_state: order.address.state,
        billing_country: "India",
        billing_email: order.address.email,
        billing_phone: order.address.phone,
        shipping_is_billing: true,
        order_items: [
          {
            name: order.product.title,
            sku: order.product.id,
            units: order.quantity,
            selling_price: order.product.price,
          },
        ],
        payment_method: "Prepaid",
        shipping_charges: 0,
        giftwrap_charges: 0,
        sub_total: order.price,
        length: 10,
        breadth: 15,
        height: 20,
        weight: 0.8,
      }),
    };

    const response = await fetch(
      "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
      options
    );
    console.log(response);
  });

  return NextResponse.json({ status: "ok" }, { status: 200 });
}
