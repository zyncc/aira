import { db } from "@/db/instance";
import { notFound } from "next/navigation";
import Script from "next/script";
import SuccessClient from "./_components/client";

type SearchParams = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function SuccessPage({ searchParams }: SearchParams) {
  const { orderId } = (await searchParams) as { orderId: string };
  if (!orderId) {
    return notFound();
  }
  const orderItems = await db.query.order.findMany({
    where: (order, o) => o.eq(order.rzpOrderId, orderId),
    with: {
      product: true,
    },
  });

  if (orderItems.length == 0) return notFound();

  const paymentSuccess = orderItems[0].paymentSuccess;
  const totalMoney = orderItems.reduce((prev, curr) => {
    return prev + curr.price * curr.quantity;
  }, 0);

  return (
    <>
      {paymentSuccess && (
        <Script id="fb-pixel-purchase" strategy="afterInteractive">
          {`
          fbq('track', 'Purchase', {
            value: ${totalMoney},
            currency: 'INR'
          });
        `}
        </Script>
      )}
      <div className="bg-background mt-[70px] px-4 py-10 md:py-16">
        <div className="mx-auto max-w-xl">
          <SuccessClient orderItems={orderItems} />
        </div>
      </div>
    </>
  );
}
