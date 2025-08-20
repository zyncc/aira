import { db } from "@/db/instance";
import { notFound } from "next/navigation";
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
    where: (order, o) =>
      o.and(o.eq(order.rzpOrderId, orderId), o.eq(order.paymentSuccess, true)),
    with: {
      product: true,
    },
  });

  if (orderItems.length == 0) return notFound();

  return (
    <div className="bg-background mt-[70px] px-4 py-10 md:py-16">
      <div className="mx-auto max-w-xl">
        <SuccessClient orderItems={orderItems} orderId={orderId} />
      </div>
    </div>
  );
}
