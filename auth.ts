import "server-only";

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins/admin";
import { oneTap } from "better-auth/plugins";
import { magicLink } from "better-auth/plugins";
import { nanoid } from "nanoid";
import MagicLinkEmail from "./components/email-templates/magic-link";
import EmailVerificationEmail from "./components/email-templates/verify-email";
import { render } from "@react-email/components";
import nodemailer from "nodemailer";

export const auth = betterAuth({
  appName: "Aira Clothing",
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    autoSignIn: false,
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
    expiresIn: 60 * 15,
    sendVerificationEmail: async ({ user, url }) => {
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
          verificationLink: url,
          userEmail: user.email,
          name: user.name,
        })
      );

      const options = {
        from: "Aira <support@airaclothing.in>",
        to: user.email,
        subject: "Verify your email address",
        html: emailHtml,
      };

      const sendEmail = await transporter.sendMail(options);
      console.log(sendEmail.accepted);
    },
  },
  plugins: [
    admin({
      impersonationSessionDuration: 60 * 10, // 10 minutes
    }),
    oneTap(),
    magicLink({
      expiresIn: 60 * 15,
      rateLimit: {
        window: 60 * 15,
        max: 3,
      },
      sendMagicLink: async ({ email, url }) => {
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
          MagicLinkEmail({ magicLink: url, userEmail: email })
        );

        const options = {
          from: "Aira <support@airaclothing.in>",
          to: email,
          subject: "Sign in to Aira by clicking the link below",
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
