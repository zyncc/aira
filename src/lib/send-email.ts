"use server";

import nodemailer from "nodemailer";

type SendEmailProps = {
  to: string;
  subject: string;
  emailHtml: string;
  from: string;
};

export async function sendEmail({ to, subject, emailHtml, from }: SendEmailProps) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.SMTP_USER as string,
      pass: process.env.SMTP_PASSWORD as string,
    },
  });

  const options = {
    from: `"${from}" <${process.env.SMTP_USER as string}>`,
    to,
    subject,
    html: emailHtml,
  };

  const sentEmail = await transporter.sendMail(options);
  console.log(`Sent email to ${sentEmail.accepted[0]}`);
}
