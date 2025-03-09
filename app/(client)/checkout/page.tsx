import React, { Suspense } from "react";
import prisma from "@/lib/prisma";
import PriceSummary from "@/app/(client)/checkout/components/priceSummary";
import { getServerSession } from "@/lib/getServerSession";
import DefaultCheckout from "./components/DefaultCheckout";

export default async function Page() {
  return (
    <Suspense fallback={"loading..."}>
      <SuspenseWrapper />
    </Suspense>
  );
}

async function SuspenseWrapper() {
  const session = await getServerSession();
  const addresses = await prisma.user.findUnique({
    where: {
      id: session?.user.id ?? "",
    },
    include: {
      address: true,
    },
  });
  return (
    <section className="container my-10">
      {!session?.session ? (
        <DefaultCheckout />
      ) : (
        <>
          <PriceSummary addresses={addresses} />
        </>
      )}
    </section>
  );
}
