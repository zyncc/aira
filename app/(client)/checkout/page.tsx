import React from "react";
import prisma from "@/lib/prisma";
import PriceSummary from "@/app/(client)/checkout/components/priceSummary";
import { headers } from "next/headers";
import { auth } from "@/auth";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: headers(),
  });
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
      <PriceSummary addresses={addresses} />
    </section>
  );
}
