import { Address } from "./types";

export async function createShipment(
  paymentMethod: "COD" | "Prepaid",
  address: Address,
  orderId: string,
  totalWeight: number,
  totalLength: number,
  totalWidth: number,
  totalHeight: number,
  codAmount?: number,
): Promise<string> {
  const shipmentData =
    paymentMethod == "COD" && codAmount
      ? {
          shipments: [
            {
              name: `${address.firstName + address.lastName || ""}`,
              order: orderId,
              phone: address.phone,
              add: `${address.address1}, ${address.address2 || ""}`,
              pin: address.zipcode,
              payment_mode: paymentMethod,
              weight: totalWeight,
              cod_amount: codAmount,
              shipment_height: totalHeight,
              shipment_length: totalLength,
              shipment_width: totalWidth,
            },
          ],
          pickup_location: { name: "mahaveer-sitara-d-block" },
        }
      : {
          shipments: [
            {
              name: `${address.firstName + address.lastName || ""}`,
              order: orderId,
              phone: address.phone,
              add: `${address.address1}, ${address.address2 || ""}`,
              pin: address.zipcode,
              payment_mode: paymentMethod,
              weight: totalWeight,
              shipment_height: totalHeight,
              shipment_length: totalLength,
              shipment_width: totalWidth,
            },
          ],
          pickup_location: { name: "mahaveer-sitara-d-block" },
        };

  const formBody = new URLSearchParams({
    format: "json",
    data: JSON.stringify(shipmentData),
  });

  const createShipment = await fetch("https://track.delhivery.com/api/cmu/create.json", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
      Authorization: process.env.DELHIVERY_TOKEN!,
    },
    body: formBody,
  }).then((res) => {
    if (!res.ok) {
      throw new Error("Failed to create shipment");
    }
    return res.json();
  });

  if (!createShipment.success) {
    throw new Error("Failed to create shipment");
  }

  return createShipment.packages?.[0]?.waybill;
}

export async function calculateTtd(address: Address) {
  const ttdData = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/pincode?pincode=${address.zipcode}`,
  ).then((res) => res.json());

  const deliveryDate = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
  );
  deliveryDate.setDate(deliveryDate.getDate() + ttdData.ttd + 1);

  return deliveryDate;
}

export async function calculateShippingCost(
  address: Address,
  totalWeight: number,
  paymentMode: "Pre-paid" | "COD",
): Promise<number> {
  const shippingCostData = await fetch(
    `https://track.delhivery.com/api/kinko/v1/invoice/charges/.json?md=S&ss=DTO&d_pin=${address.zipcode}&o_pin=560078&cgm=${totalWeight}&pt=${paymentMode}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.DELHIVERY_TOKEN as string,
      },
    },
  ).then((res) => {
    if (!res.ok) {
      throw new Error("Failed to calculate shipping cost");
    }
    return res.json();
  });

  if (!shippingCostData || shippingCostData.length === 0) {
    return 50;
  }
  const shippingCost: number = shippingCostData[0].total_amount;

  return shippingCost;
}
