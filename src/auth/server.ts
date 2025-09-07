import "server-only";

import { db } from "@/db/instance";
import { sendEmailOTP } from "@/functions/auth/emails/send-email-otp";
import { sendPhoneOTP } from "@/functions/auth/emails/send-phone-otp";
import { sendWelcomeEmail } from "@/functions/auth/emails/send-welcome-mail";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin, emailOTP, oneTap, phoneNumber } from "better-auth/plugins";
import { uuid } from "../lib/utils";

export const auth = betterAuth({
  appName: "Aira Clothing",
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
    revokeSessionsOnPasswordReset: true,
    requireEmailVerification: true,
    autoSignIn: true,
  },
  user: {
    additionalFields: {
      emailOffers: {
        type: "boolean",
        defaultValue: true,
      },
      storeCredit: {
        type: "number",
        defaultValue: 0,
      },
    },
  },
  account: {
    accountLinking: {
      enabled: true,
    },
  },
  logger: {
    level: "error",
    disabled: false,
  },
  session: {
    expiresIn: 3600 * 24 * 14, // 2 weeks
    updateAge: 3600 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 3600 * 24 * 14, // 2 weeks
    },
  },
  advanced: {
    ipAddress: {
      ipAddressHeaders: ["x-forwarded-for", "x-real-ip"],
      disableIpTracking: false,
    },
    database: {
      generateId: () => uuid(),
    },
    crossSubDomainCookies: {
      enabled: process.env.NODE_ENV !== "development",
      domain: ".airaclothing.in",
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          sendWelcomeEmail(user.email, user.name);
        },
      },
    },
  },
  rateLimit: {
    enabled: true,
    storage: "database",
    customRules: {
      "/phone-number/send-otp": {
        window: 60 * 30,
        max: 5,
      },
      "/email-otp/send-verification-otp": {
        window: 60 * 30,
        max: 5,
      },
    },
  },
  socialProviders: {
    twitter: {
      clientId: process.env.TWITTER_CLIENT_ID as string,
      clientSecret: process.env.TWITTER_CLIENT_SECRET as string,
      enabled: true,
    },
    google: {
      prompt: "select_account",
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      enabled: true,
    },
  },
  trustedOrigins: [
    "https://tuna-darling-overly.ngrok-free.app",
    "http://localhost:3000",
    "https://relevant-duly-tomcat.ngrok-free.app",
    "https://airaclothing.in",
    "https://admin.airaclothing.in",
  ],
  plugins: [
    admin({
      impersonationSessionDuration: 60 * 15, // 15 minutes
    }),
    oneTap(),
    phoneNumber({
      allowedAttempts: 5,
      otpLength: 6,
      expiresIn: 60 * 15, // 15 minutes
      sendOTP: async ({ phoneNumber, code }) => {
        sendPhoneOTP(phoneNumber, code);
      },
    }),
    emailOTP({
      otpLength: 6,
      expiresIn: 60 * 15, // 15 minutes
      disableSignUp: false,
      sendVerificationOTP: async ({ email, otp }) => {
        sendEmailOTP(email, otp);
      },
    }),
    nextCookies(),
  ], // make sure this is the last plugin in the array
});

export type Session = typeof auth.$Infer.Session;
