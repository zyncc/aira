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
      impersonationSessionDuration: 60 * 15, // 15 minutes
    }),
    oneTap(),
    phoneNumber({
      otpLength: 6,
      expiresIn: 60 * 15, // 15 minutes
      sendOTP: async ({ phoneNumber, code }) => {
        const response = await fetch(
          `https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_NUMBER}/messages`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${process.env.WHATSAPP_CLOUD_API_KEY}`,
            },
            body: JSON.stringify({
              messaging_product: "whatsapp",
              to: `+91${phoneNumber}`,
              type: "template",
              template: {
                name: "login_otp",
                language: {
                  code: "en",
                },
                components: [
                  {
                    type: "body",
                    parameters: [
                      {
                        type: "text",
                        text: code,
                      },
                    ],
                  },
                  {
                    type: "button",
                    sub_type: "url",
                    index: "0",
                    parameters: [
                      {
                        type: "text",
                        text: code,
                      },
                    ],
                  },
                ],
              },
            }),
          }
        );
        const data = await response.json();
        console.log(data);
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

    crossSubDomainCookies: {
      enabled: true,
      domain: "admin.airaclothing.in",
    },
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
  trustedOrigins: [
    "http://localhost:3000",
    "http://admin.localhost:3000",
    "https://admin.airaclothing.in",
    "https://airaclothing.in",
  ],
  socialProviders: {
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
      enabled: true,
    },
    google: {
      prompt: "select_account",
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      enabled: true,
    },
  },
});

export type Session = typeof auth.$Infer.Session;
