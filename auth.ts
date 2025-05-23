import "server-only";

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins/admin";
import { oneTap } from "better-auth/plugins";
import { magicLink } from "better-auth/plugins";
import { Resend } from "resend";
import { nanoid } from "nanoid";

export const auth = betterAuth({
  appName: "Aira Clothing",
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    admin({
      impersonationSessionDuration: 60 * 10, // 10 minutes
    }),
    oneTap(),
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const emailSent = await resend.emails.send({
          from: "Aira <contact@airaclothing.in>",
          to: [email],
          subject: "Sign In Magic Link",
          text: url,
        });
        console.log(emailSent);
      },
    }),
    nextCookies(),
  ],
  account: {
    accountLinking: {
      enabled: true,
    },
  },
  advanced: {
    generateId: () => nanoid(12),
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24, // 1 day
    },
  },
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  trustedOrigins: [
    "https://airaclothing.in",
    "https://airaclothing.in/api/auth",
    "https://airaa.vercel.app",
    "https://airaa.vercel.app/api/auth",
    "http://localhost:3000",
    "https://tuna-darling-overly.ngrok-free.app",
  ],
});

export type Session = typeof auth.$Infer.Session;
