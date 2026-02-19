"use server";

import { db } from "@/db/instance";
import { order, quantity } from "@/db/schema";
import {
  AuthorizationErrorResponse,
  ErrorResponse,
  SuccessResponse,
} from "@/lib/api-responses";
import { createShipment } from "@/lib/delhivery";
import { FullOrderType } from "@/lib/types";
import { sendWhatsappMessage } from "@/lib/utils";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { sendOrderReceipt } from "../auth/emails/send-order-receipt";
import { getServerSession } from "../auth/get-server-session";

export async function ApproveOrder(orderData: FullOrderType) {
  try {
    const session = await getServerSession(true);

    if (!session || session.user.role !== "admin") {
      return AuthorizationErrorResponse();
    }

    const totalWeight = orderData.items.reduce(
      (acc, item) => acc + item.product.weight,
      0,
    );
    const totalLength = orderData.items.reduce(
      (acc, item) => acc + item.product.length,
      0,
    );
    const totalWidth = orderData.items.reduce(
      (acc, item) => acc + item.product.breadth,
      0,
    );
    const totalHeight = orderData.items.reduce(
      (acc, item) => acc + item.product.height,
      0,
    );

    const waybill = await createShipment(
      "COD",
      orderData,
      orderData.id,
      totalWeight,
      totalLength,
      totalWidth,
      totalHeight,
      orderData.totalPrice,
    );

    if (waybill.length <= 0) {
      throw new Error("Failed to create shipment");
    }

    await db.transaction(async (tx) => {
      await tx
        .update(order)
        .set({ waybill, isCodApproved: true })
        .where(eq(order.id, orderData.id));

      for (const o of orderData.items) {
        await tx
          .update(quantity)
          .set({
            sm: sql`${quantity.sm} - ${o.size === "sm" ? o.quantity : 0}`,
            md: sql`${quantity.md} - ${o.size === "md" ? o.quantity : 0}`,
            lg: sql`${quantity.lg} - ${o.size === "lg" ? o.quantity : 0}`,
            xl: sql`${quantity.xl} - ${o.size === "xl" ? o.quantity : 0}`,
            doublexl: sql`${quantity.doublexl} - ${o.size === "doublexl" ? o.quantity : 0}`,
          })
          .where(eq(quantity.productId, o.productId));
      }
    });

    try {
      await Promise.all([
        sendWhatsappMessage(orderData.phone, { ...orderData, waybill }),
        sendOrderReceipt(
          waybill,
          orderData.user.name,
          orderData.id,
          orderData,
          orderData.paymentId,
          orderData.ttd,
          orderData.user.email,
        ),
      ]);
    } catch (e) {
      console.error(e);
    }

    return SuccessResponse("Order Approved");
  } catch (error) {
    if (error instanceof Error) {
      return ErrorResponse(error.message);
    }
    return ErrorResponse("Something went wrong");
  }
}

export async function DeleteOrder(orderId: string) {
  const session = await getServerSession(true);

  if (!session || session.user.role !== "admin") {
    return AuthorizationErrorResponse();
  }

  await db.delete(order).where(eq(order.id, orderId));

  revalidatePath("/admin/cod-orders");

  return SuccessResponse("Order Deleted");
}
