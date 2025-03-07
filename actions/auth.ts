"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { z } from "zod";
import { signUpFormSchema } from "@/lib/zodSchemas";

export async function signInMagicLink(email: string, callbackURL: string) {
  try {
    const response = await auth.api.signInMagicLink({
      body: {
        email,
        callbackURL,
      },
      headers: await headers(),
    });
    return response;
  } catch (error) {
    return {
      status: false,
    };
  }
}

export async function signUp(
  data: z.infer<typeof signUpFormSchema>,
  callbackURL: string
) {
  const { email, name, phone } = data;
  try {
    const user = await prisma.user.create({
      data: {
        email,
        phone,
        name,
      },
    });
    const response = await auth.api.signInMagicLink({
      body: {
        email: user.email,
        callbackURL,
      },
      headers: await headers(),
    });
    return response;
  } catch (error) {
    console.log(error);
    return {
      status: false,
    };
  }
}

export async function signInSocial(callbackUrl: string) {
  try {
    const response = await auth.api.signInSocial({
      body: {
        provider: "google",
        callbackURL: callbackUrl as string,
      },
      headers: await headers(),
    });
    return {
      status: true,
      data: response,
    };
  } catch (error) {
    return {
      status: false,
    };
  }
}

export async function signOut() {
  try {
    const response = await auth.api.signOut({
      headers: await headers(),
    });
    return response;
  } catch (error) {
    return {
      status: false,
    };
  }
}
