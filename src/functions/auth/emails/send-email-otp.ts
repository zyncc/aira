import "server-only";

import EmailVerification from "@/components/emails/email-otp";
import { sendEmail } from "@/lib/send-email";
import { render } from "@react-email/components";

export async function sendEmailOTP(email: string, code: string) {
  const emailHtml = await render(EmailVerification({ otpCode: code, userEmail: email }));
  await sendEmail({
    to: email,
    subject: "Verify your email",
    emailHtml,
    from: "Aira Login OTP",
  });
}
