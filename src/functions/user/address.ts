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

    const hasAtleastOneAddress = await db.query.address.findFirst({
      where: (address) => eq(address.userId, session.user.id),
    });

    try {
      if (!hasAtleastOneAddress) {
        await db
          .update(user)
          .set({
            phoneNumber: data.phone,
          })
          .where(eq(user.id, session.user.id));
      }
    } catch (error) {
      console.error(error);
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

export async function createGuestAddress(data: z.infer<typeof CreateCheckoutUser>) {
  try {
    let userId: string;
    let phoneNumber: string | null;

    // Check if user already exists
    const existingUser = await db.query.user.findFirst({
      where: (user) => eq(user.email, data.email),
      columns: { id: true, phoneNumber: true },
    });

    if (existingUser) {
      userId = existingUser.id;
      phoneNumber = existingUser.phoneNumber;
    } else {
      // 2. Create new user
      const [newUser] = await db
        .insert(user)
        .values({
          id: uuid(),
          email: data.email,
          name: `${data.firstName} ${data.lastName}`,
          role: "user",
          phoneNumber: data.phone,
          emailOffers: data.emailOffers,
        })
        .returning({ id: user.id, phoneNumber: user.phoneNumber });

      userId = newUser.id;
      phoneNumber = newUser.phoneNumber;
    }

    // 3. Check if pincode is serviceable
    const pincodeRes = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/pincode?pincode=${data.zipcode}`,
    );
    const pincode = await pincodeRes.json();

    if (!pincode.success) {
      return { success: false, message: "This pincode is not serviceable" };
    }

    // 4. If user had no phoneNumber previously, update it
    if (!phoneNumber) {
      try {
        await db.update(user).set({ phoneNumber: data.phone }).where(eq(user.id, userId));
      } catch (error) {
        console.log(error);
      }
    }

    // 5. Insert address
    const addressId = uuid();
    await db.insert(address).values({
      id: addressId,
      userId,
      ...data,
    });

    // 6. Fetch the newly created address
    const createdAddress = await db.query.address.findFirst({
      where: (address) => eq(address.id, addressId),
    });

    // 7. Revalidate pages
    revalidatePath("/checkout");
    revalidatePath("/account/addresses");

    // 8. Log user activity
    await db.insert(activity).values({
      id: uuid(),
      userId,
      title: "New address added",
      type: "address",
    });

    // 9. Return success
    return createdAddress
      ? {
          success: true,
          message: "Address added successfully",
          data: { ...createdAddress },
        }
      : { success: false, message: "Failed to retrieve address after creation" };
  } catch (error) {
    console.error("Error in createGuestAddress:", error);
    return { success: false, message: "Something went wrong, try again" };
  }
}

export async function updateUserAddress(data: z.infer<typeof AddressFormSchema>) {
  const session = await getServerSession();
  if (!session) {
    return AuthErrorResponse();
  }
  const findAddress = await db.query.address.findFirst({
    where: (address, o) => o.eq(address.userId, session.user.id),
    columns: {
      id: true,
    },
  });

  if (!findAddress) {
    return ErrorResponse("Failed to find address or it does not exist");
  }

  const { id, ...rest } = data;

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
