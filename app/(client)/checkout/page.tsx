import React from "react";
import prisma from "@/lib/prisma";
import PriceSummary from "@/app/(client)/checkout/components/priceSummary";
import {notFound} from "next/navigation";
import {headers} from "next/headers";
import {auth} from "@/auth";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: headers(),
  });
  if (!session?.user) {
    return notFound();
  }
  const addresses = await prisma.user.findUnique({
    where: {
      id: session?.user.id,
    },
    include: {
      address: true,
    },
  });
  return (
    <section className="container my-10">
      {/* <CheckoutBlock getAddresses={getAddresses} session={session} /> */}
      <PriceSummary addresses={addresses} session={session} />
    </section>
  );
}
