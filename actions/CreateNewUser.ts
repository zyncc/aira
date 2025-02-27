"use server";

import prisma from "@/lib/prisma";
import { CreateCheckoutUser, signUpFormSchema } from "@/lib/zodSchemas";
import { z } from "zod";

export async function CreateUser(data: z.infer<typeof CreateCheckoutUser>) {
  try {
    const user = await prisma.user.create({
      data: {
        name: data.firstName,
        email: data.email,
        phone: data.phone,
        usingSocialLogin: false,
      },
    });
    return user;
  } catch (error) {
    console.log("User already exists");
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
  const address = await prisma.address.create({
    data: {
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

export async function CreateSignupUser(data: z.infer<typeof signUpFormSchema>) {
  const { email, name, phone } = data;
  try {
    const user = await prisma.user.create({
      data: {
        email,
        phone,
        name,
      },
    });
    return user;
  } catch (error) {
    console.log(error);
  }
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });
  return user;
}
