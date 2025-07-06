import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins/admin";
import { oneTap } from "better-auth/plugins";
import { emailOTP } from "better-auth/plugins";
import { nanoid } from "nanoid";
import { render } from "@react-email/components";
import nodemailer from "nodemailer";
import { phoneNumber } from "better-auth/plugins";
import EmailVerificationEmail from "./components/email-templates/email-otp";

export const auth = betterAuth({
  appName: "Aira Clothing",
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    autoSignIn: true,
  },
  plugins: [
    admin({
      impersonationSessionDuration: 60 * 10, // 10 minutes
    }),
    oneTap(),
    phoneNumber({
      otpLength: 6,
      expiresIn: 60 * 15, // 15 minutes
      sendOTP: ({ phoneNumber, code }) => {
        console.log("Phone OTP", code);
      },
    }),
    emailOTP({
      otpLength: 6,
      expiresIn: 60 * 15, // 15 minutes
      disableSignUp: false,
      sendVerificationOTP: async ({ email, otp }) => {
        const transporter = nodemailer.createTransport({
          host: "smtp.hostinger.com",
          port: 465,
          secure: true,
          auth: {
            user: "support@airaclothing.in",
            pass: process.env.SMTP_PASSWORD,
          },
        });
        const emailHtml = await render(
          EmailVerificationEmail({
            otpCode: otp,
            userEmail: email,
          })
        );
        const options = {
          from: "Aira <support@airaclothing.in>",
          to: email,
          subject: "Email Verification",
          html: emailHtml,
        };
        const sendEmail = await transporter.sendMail(options);
        console.log(sendEmail.accepted);
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
});

export type Session = typeof auth.$Infer.Session;
