import React from "react";
import prisma from "@/lib/prisma";
import getSession from "@/lib/getSession";
import CheckoutBlock from "@/app/(client)/checkout/components/checkoutBlock";
import PriceSummary from "@/app/(client)/checkout/components/priceSummary";
import {notFound} from "next/navigation";

export default async function Page() {
  const session = await getSession();
  if (!session?.user) {
    return notFound();
  }
  const getAddresses = await prisma.user.findUnique({
    where: {
      id: session?.user.id,
    },
    include: {
      address: true,
    },
  });
  return (
    <section className="container my-10 gap-x-10 flex flex-col md:flex-row gap-y-[70px]">
      <CheckoutBlock getAddresses={getAddresses} session={session} />
      <PriceSummary />
    </section>
  );
}
