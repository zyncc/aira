import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url!);
  const pincode = searchParams.get("pincode");

  if (!pincode) {
    return NextResponse.json({
      success: false,
      message: "No pincode provided",
    });
  }

  const getTTD = await fetch(
    `https://track.delhivery.com/api/dc/expected_tat?origin_pin=560078&destination_pin=${pincode}&mot=S`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.DELHIVERY_TOKEN!,
      },
    },
  );

  const data = await getTTD.json();

  if (!data.success) {
    return NextResponse.json({
      success: false,
      message: "This pincode is not Serviceable",
    });
  }

  console.log(data);

  return NextResponse.json({
    success: true,
    ttd: data.data.tat + 1,
  });
}
