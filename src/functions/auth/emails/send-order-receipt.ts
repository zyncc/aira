import "server-only";

import OrderConfirmationEmail from "@/components/emails/order-receipt";
import { sendEmail } from "@/lib/send-email";
import { FullOrderType } from "@/lib/types";
import { render } from "@react-email/components";

export async function sendOrderReceipt(
  awbNumber: string | null,
  customerName: string,
  orderId: string,
  orders: FullOrderType,
  paymentId: string | null,
  ttd: Date | null,
  email: string,
) {
  const emailHtml = await render(
    OrderConfirmationEmail({
      awbNumber,
      customerName,
      orderDate: new Date().toISOString(),
      orderId,
      orders,
      paymentId,
      ttd,
    }),
  );
  await sendEmail({
    to: email,
    subject: "Order Confirmation",
    emailHtml,
    from: "Aira Order Receipt",
  });
}
