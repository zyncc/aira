"use server";

import { db } from "@/db/instance";
import { quantity, returns, user } from "@/db/schema";
import {
  AuthorizationErrorResponse,
  ErrorResponse,
  SuccessResponse,
} from "@/lib/api-responses";
import { uuid } from "@/lib/utils";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getServerSession } from "../auth/get-server-session";

export async function ApproveReturn(id: string) {
  const session = await getServerSession();

  if (!session || session.user.role !== "admin") {
    return AuthorizationErrorResponse();
  }

  const returnRequest = await db.query.returns.findFirst({
    where: (fields, operators) => operators.eq(fields.id, id),
    with: {
      order: true,
    },
  });

  if (!returnRequest) {
    return ErrorResponse("Return Not Found", { code: 404 });
  }

  // Update Approve Status
  await db
    .update(returns)
    .set({
      approved: true,
    })
    .where(eq(returns.id, id));

  // Create Reverse Shipment
  const shipmentData = {
    shipments: [
      {
        name: `${returnRequest.order.firstName + returnRequest.order.lastName || ""}`,
        order: uuid(),
        phone: returnRequest.order.phone,
        add: `${returnRequest.order.address1}, ${returnRequest.order.address2 || ""}`,
        pin: returnRequest.order.zipcode,
        payment_mode: "Pickup",
      },
    ],
    pickup_location: { name: "mahaveer-sitara" },
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
  }).then((res) => res.json());

  const waybill: string = createShipment.packages?.[0]?.waybill;

  console.log("WAYBILL: ", waybill);

  revalidatePath("/admin/returns");
  revalidatePath(`/account/orders/${returnRequest.orderId}`);

  console.log("Return Approved Successfully");

  return SuccessResponse("Return Approved Successfully");
}

export async function DeclineReturn(id: string) {
  const session = await getServerSession();

  if (!session || session.user.role !== "admin") {
    return AuthorizationErrorResponse();
  }

  const returnRequest = await db.query.returns.findFirst({
    where: (fields, operators) => operators.eq(fields.id, id),
  });

  if (!returnRequest) {
    return ErrorResponse("Return Not Found", { code: 404 });
  }

  await db
    .update(returns)
    .set({
      approved: false,
      notApprovedReason: "Tags are missing",
    })
    .where(eq(returns.id, id));

  revalidatePath("/admin/returns");
  revalidatePath(`/account/orders/${returnRequest.orderId}`);

  return SuccessResponse("Return Declined Successfully");
}

export async function ApproveFinalReturn(id: string) {
  const session = await getServerSession();

  if (!session || session.user.role !== "admin") {
    return AuthorizationErrorResponse();
  }

  const returnRequest = await db.query.returns.findFirst({
    where: (fields, operators) => operators.eq(fields.id, id),
    with: {
      order: true,
    },
  });

  if (!returnRequest) {
    return ErrorResponse("Return Not Found", { code: 404 });
  }

  const returnType = returnRequest.type;

  await db
    .update(returns)
    .set({
      finalApproved: true,
    })
    .where(eq(returns.id, id));

  if (returnType === "return") {
    // Update User Store Credit and Update the Quantity for Product
    await db
      .update(user)
      .set({
        storeCredit: sql`${user.storeCredit} + ${returnRequest.order.price}`,
      })
      .where(eq(user.id, returnRequest.userId));

    await db.update(quantity).set({
      sm: sql`${quantity.sm} + ${returnRequest.order.size === "sm" ? returnRequest.order.quantity : 0}`,
      md: sql`${quantity.md} + ${returnRequest.order.size === "md" ? returnRequest.order.quantity : 0}`,
      lg: sql`${quantity.lg} + ${returnRequest.order.size === "lg" ? returnRequest.order.quantity : 0}`,
      xl: sql`${quantity.xl} + ${returnRequest.order.size === "xl" ? returnRequest.order.quantity : 0}`,
      doublexl: sql`${quantity.doublexl} + ${returnRequest.order.size === "doublexl" ? returnRequest.order.quantity : 0}`,
    });
  } else if (returnType === "exchange") {
    // Create shipment
    const shipmentData = {
      shipments: [
        {
          name: `${returnRequest.order.firstName + returnRequest.order.lastName || ""}`,
          order: uuid(),
          phone: returnRequest.order.phone,
          add: `${returnRequest.order.address1}, ${returnRequest.order.address2 || ""}`,
          pin: returnRequest.order.zipcode,
          payment_mode: "Prepaid",
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
      },
    ).then((res) => res.json());

    const waybill = createShipment.packages?.[0]?.waybill;

    console.log("WAYBILL: ", waybill);
  }
  revalidatePath("/admin/returns");
  revalidatePath(`/account/orders/${returnRequest.orderId}`);

  return SuccessResponse("Approved Final Return Successfully");
}

export async function DeclineFinalReturn(id: string) {
  const session = await getServerSession();

  if (!session || session.user.role !== "admin") {
    return AuthorizationErrorResponse();
  }

  const returnRequest = await db.query.returns.findFirst({
    where: (fields, operators) => operators.eq(fields.id, id),
    with: {
      order: true,
    },
  });

  if (!returnRequest) {
    return ErrorResponse("Return Not Found", { code: 404 });
  }

  // Create shipment
  const shipmentData = {
    shipments: [
      {
        name: `${returnRequest.order.firstName + returnRequest.order.lastName || ""}`,
        order: uuid(),
        phone: returnRequest.order.phone,
        add: `${returnRequest.order.address1}, ${returnRequest.order.address2 || ""}`,
        pin: returnRequest.order.zipcode,
        payment_mode: "Prepaid",
      },
    ],
    pickup_location: { name: "mahaveer-sitara" },
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
  }).then((res) => res.json());

  const waybill = createShipment.packages?.[0]?.waybill;

  console.log("WAYBILL: ", waybill);

  await db
    .update(returns)
    .set({
      finalApproved: false,
      finalNotApprovedReason: "Tags are missing",
    })
    .where(eq(returns.id, id));

  revalidatePath("/admin/returns");
  revalidatePath(`/account/orders/${returnRequest.orderId}`);

  return SuccessResponse("Declined Final Return Successfully");
}
