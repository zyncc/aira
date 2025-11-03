"use server";

import { db } from "@/db/instance";
import { activity, address, user } from "@/db/schema";
import {
  AuthErrorResponse,
  AuthorizationErrorResponse,
  ErrorResponse,
  SuccessResponse,
} from "@/lib/api-responses";
import { uuid } from "@/lib/utils";
import { AddressFormSchema, CreateCheckoutUser } from "@/lib/zod-schemas";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import z from "zod";
import { getServerSession } from "../auth/get-server-session";

export async function createNewAddress(data: z.infer<typeof AddressFormSchema>) {
  try {
    const session = await getServerSession();
    if (!session) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }
    const getTTD = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/pincode?pincode=${data.zipcode}`,
    );
    const pincode = await getTTD.json();

    if (!pincode.success) {
      return {
        success: false,
        message: "This pincode is not serviceable",
      };
    }

    await db.insert(address).values({
      id: uuid(),
      userId: session.user.id,
      ...data,
    });

    revalidatePath("/checkout");
    revalidatePath("/account/addresses");

    await db.insert(activity).values({
      id: uuid(),
      userId: session.user.id,
      title: "New address added",
      type: "address",
    });
    console.log("Address Created");
    return {
      success: true,
      message: "Created address",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Something went wrong",
    };
  }
}

export async function updateUserAddress(data: z.infer<typeof AddressFormSchema>) {
  const session = await getServerSession();
  if (!session) {
    return AuthErrorResponse();
  }
  const { success } = AddressFormSchema.safeParse(data);
  const { id, ...rest } = data;
  if (!success || !id) {
    return ErrorResponse("Invalid Data");
  }

  const findAddress = await db.query.address.findFirst({
    where: (address, o) =>
      o.and(o.eq(address.id, id), o.eq(address.userId, session.user.id)),
    columns: {
      id: true,
    },
  });

  if (!findAddress) {
    return ErrorResponse("Failed to find address or it does not exist");
  }

  if (findAddress.id != id) {
    return AuthorizationErrorResponse();
  }

  try {
    await db
      .update(address)
      .set({
        ...rest,
      })
      .where(and(eq(address.id, id), eq(address.userId, session.user.id)));

    revalidatePath("/checkout");
    revalidatePath("/account/addresses");

    await db.insert(activity).values({
      id: uuid(),
      userId: session.user.id,
      title: "Updated address",
      type: "address",
    });

    return SuccessResponse();
  } catch (error) {
    console.log(error);
    return ErrorResponse("Failed to update Address");
  }
}

export async function DeleteAddress(id: string) {
  try {
    const session = await getServerSession();
    if (!session) {
      return AuthErrorResponse();
    }

    if (!id) {
      return ErrorResponse("No Id Provided");
    }

    const findAddress = await db.query.address.findFirst({
      where: (address, o) => o.eq(address.id, id),
      columns: {
        id: true,
        userId: true,
      },
    });

    if (!findAddress || findAddress.userId !== session.user.id) {
      return AuthorizationErrorResponse();
    }

    await db.delete(address).where(eq(address.id, id));
    await db.insert(activity).values({
      id: uuid(),
      userId: session.user.id,
      title: "Address Deleted",
      type: "address",
    });
    revalidatePath("/checkout");
    revalidatePath("/account/addresses");
    return SuccessResponse("Address deleted successfully");
  } catch (error) {
    console.error(error);
    return ErrorResponse("Failed to delete Address");
  }
}
