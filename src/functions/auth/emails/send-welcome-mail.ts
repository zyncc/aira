import "server-only";

import WelcomeEmail from "@/components/emails/welcome-email";
import { sendEmail } from "@/lib/send-email";
import { render } from "@react-email/components";

export async function sendWelcomeEmail(email: string, firstName: string) {
  const emailHtml = await render(WelcomeEmail({ email, firstName }));
  await sendEmail({
    to: email,
    subject: "Welcome to Aira!",
    emailHtml,
    from: "Aira",
  });
}
