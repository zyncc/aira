import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins/admin";
import { oneTap } from "better-auth/plugins";

export const auth = betterAuth({
  plugins: [
    nextCookies(),
    admin({
      impersonationSessionDuration: 60 * 10, // 10 minutes
    }),
    oneTap(),
  ],
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 8,
  },
  account: {
    accountLinking: {
      enabled: true,
    },
  },
  advanced: {
    generateId: false,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60, // 1 hour
    // cookieCache: {
    //   enabled: true,
    //   maxAge: 60 * 60,
    // },
  },
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  trustedOrigins: [
    "https://pansy.in",
    "https://pansy.in/api/auth",
    "http://localhost:3000",
    "https://tuna-darling-overly.ngrok-free.app",
  ],
});

export type Session = typeof auth.$Infer.Session;
