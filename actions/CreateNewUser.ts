"use server";

import WelcomeEmail from "@/components/email-templates/welcome-email";
import prisma from "@/lib/prisma";
import { CreateCheckoutUser } from "@/lib/zodSchemas";
import { render } from "@react-email/components";
import { uuid } from "@/lib/utils";

import { z } from "zod";
import nodemailer from "nodemailer";

export async function CreateUser(data: z.infer<typeof CreateCheckoutUser>) {
  try {
    const user = await prisma.user.create({
      data: {
        id: uuid(),
        name: data.firstName,
        email: data.email,
        phoneNumber: data.phone,
      },
    });
    if (user) {
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
          email: data.email,
          firstName: data.firstName,
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
    }
    return user;
  } catch (error) {
    console.log("User already exists");
    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });
    return user;
  }
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
  try {
    await prisma.user.update({
      where: {
        id: id!,
      },
      data: {
        phoneNumber: data.phone,
      },
    });
  } catch (error) {
    console.log(error);
  }
  const address = await prisma.address.create({
    data: {
      id: uuid(),
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
