"use server";

import { db } from "@/db/instance";
import { user } from "@/db/schema";
import { AuthErrorResponse, ErrorResponse, SuccessResponse } from "@/lib/api-responses";
import { eq } from "drizzle-orm";
import { getServerSession } from "../auth/get-server-session";

export async function handleEmailOffers(event: boolean) {
  try {
    const session = await getServerSession();
    if (!session) {
      return AuthErrorResponse();
    }
    await db
      .update(user)
      .set({
        emailOffers: event,
      })
      .where(eq(user.id, session.user.id));
    return SuccessResponse();
  } catch (error) {
    console.error(error);
    return ErrorResponse("Failed to update setting");
  }
}
