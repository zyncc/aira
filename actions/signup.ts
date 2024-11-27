"use server";

import prisma from "@/lib/prisma";
import { signUpFormSchema } from "@/lib/zodSchemas";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";

export async function createUser(
  {
    name,
    email,
    password,
    phone,
  }: {
    name: string;
    email: string;
    password: string;
    phone: string;
  },
  callbackUrl: string | string[] | undefined
) {
  const { error } = signUpFormSchema.safeParse({
    name,
    email,
    password,
    phone,
  });
  if (error) {
    return null;
  }
  const userExists = await prisma.user.findUnique({ where: { email } });
  if (userExists?.usingSocialLogin) {
    return "Account exists, Try using Social login";
  }
  if (userExists) {
    return "Account already exists";
  }
  const saltRounds = 10;
  const hash = bcrypt.hashSync(password, saltRounds);
  try {
    await prisma.user.create({
      data: {
        name,
        email,
        password: hash,
        phone,
        usingSocialLogin: false,
      },
    });
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong while creating user");
  }
  redirect("/signin?callbackUrl=" + callbackUrl);
}
