import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url!);
  const pincode = searchParams.get("pincode");
  const totalWeight = searchParams.get("totalWeight");

  if (!pincode) {
    return NextResponse.json({
      success: false,
      message: "No pincode provided",
    });
  }

  if (!totalWeight) {
    return NextResponse.json({
      success: false,
      message: "No total weight provided",
    });
  }

  const res = await fetch(
    `https://track.delhivery.com/api/kinko/v1/invoice/charges/.json?md=S&ss=DTO&d_pin=${pincode}&o_pin=560078&cgm=${totalWeight}&pt=COD`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${process.env.DELHIVERY_TOKEN as string}`,
      },
    },
  );

  const shippingCostData = await res.json();
  const shippingCost: number = shippingCostData[0].total_amount || 0;

  if (!res.ok) {
    return NextResponse.json({
      success: false,
      message: "This pincode is not Serviceable",
    });
  }

  return NextResponse.json({
    success: true,
    shippingCost,
  });
}
