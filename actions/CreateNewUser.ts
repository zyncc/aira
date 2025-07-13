"use server";

import prisma from "@/lib/prisma";
import { CreateCheckoutUser, signUpFormSchema } from "@/lib/zodSchemas";
import ShortUniqueId from "short-unique-id";
const { randomUUID } = new ShortUniqueId({ length: 12 });
import { z } from "zod";

export async function CreateUser(data: z.infer<typeof CreateCheckoutUser>) {
  try {
    const user = await prisma.user.create({
      data: {
        id: randomUUID(),
        name: data.firstName,
        email: data.email,
        phoneNumber: data.phone,
      },
    });
    return user;
  } catch (error) {
    console.log("User already exists");
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });
  return user;
}

export async function CreateUserAddress(
  data: z.infer<typeof CreateCheckoutUser>,
  id: string | undefined
) {
  const {
    address1,
    address2,
    city,
    email,
    firstName,
    landmark,
    lastName,
    phone,
    state,
    zipcode,
  } = data;
  try {
    await prisma.user.update({
      where: {
        id: id!,
      },
      data: {
        phoneNumber: data.phone,
      },
    });
  } catch (error) {
    console.log(error);
  }
  const address = await prisma.address.create({
    data: {
      id: randomUUID(),
      userId: id!,
      address1,
      address2,
      city,
      email,
      firstName,
      landmark,
      lastName,
      phone,
      state,
      zipcode,
    },
  });
  return address;
}
