import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins/admin";
import { oneTap } from "better-auth/plugins";
import { emailOTP } from "better-auth/plugins";
import ShortUniqueId from "short-unique-id";
const { randomUUID } = new ShortUniqueId({ length: 12 });
import { render } from "@react-email/components";
import nodemailer from "nodemailer";
import { phoneNumber } from "better-auth/plugins";
import EmailVerificationEmail from "./components/email-templates/email-otp";
import WelcomeEmail from "./components/email-templates/welcome-email";

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
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
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
            WelcomeEmail({
              email: user.email,
              firstName: user.name,
            })
          );
          const options = {
            from: "Aira <support@airaclothing.in>",
            to: user.email,
            subject: "Welcome to Aira!",
            html: emailHtml,
          };
          const sendEmail = await transporter.sendMail(options);
          console.log(sendEmail.accepted);
        },
      },
    },
  },
  account: {
    accountLinking: {
      enabled: true,
    },
  },
  advanced: {
    ipAddress: {
      ipAddressHeaders: ["x-forwarded-for", "x-real-ip"],
      disableIpTracking: false,
    },
    database: {
      generateId: () => randomUUID(),
    },
    crossSubDomainCookies: {
      enabled: process.env.NODE_ENV !== "development",
      domain:
        process.env.NODE_ENV == "development"
          ? ".localhost"
          : ".airaclothing.in",
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
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
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
});

export type Session = typeof auth.$Infer.Session;
