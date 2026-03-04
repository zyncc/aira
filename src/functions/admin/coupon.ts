"use server";

import { db } from "@/db/instance";
import { coupons } from "@/db/schema";
import {
  AuthorizationErrorResponse,
  ErrorResponse,
  SuccessResponse,
} from "@/lib/api-responses";
import { uuid } from "@/lib/utils";
import { createCouponCodeSchema } from "@/lib/zod-schemas";
import { revalidatePath } from "next/cache";
import z from "zod";
import { getServerSession } from "../auth/get-server-session";

export async function CreateCoupon(values: z.infer<typeof createCouponCodeSchema>) {
  try {
    const session = await getServerSession();

    if (!session || session.user.role !== "admin") {
      return AuthorizationErrorResponse();
    }

    const { success, data } = createCouponCodeSchema.safeParse(values);

    if (!success) {
      return ErrorResponse("Invalid Data");
    }

    await db.insert(coupons).values({
      id: uuid(),
      code: data.code,
      type: data.type,
      firstOrder: data.firstOrder,
      minOrderValue: data.minOrderValue,
      startsAt: data.startsAt,
      usageLimit: data.usageLimit,
      value: data.value,
      isActive: data.isActive,
      expiresAt: data.endsAt,
    });

    revalidatePath("/admin/coupons");

    return SuccessResponse("Coupon Created");
  } catch (error: any) {
    if (error.code === "23505") {
      console.error("Error creating coupon:", error);
      return ErrorResponse("Coupon code already exists");
    }
    console.error("Error creating coupon:", error);
    return ErrorResponse("Failed to create coupon");
  }
}
