import { Container } from "@/components/container";
import { db } from "@/db/instance";
import { getServerSession } from "@/functions/auth/get-server-session";
import { eq } from "drizzle-orm";
import { Metadata } from "next";
import ModernCheckout from "./_components/checkout";

export const metadata: Metadata = {
  title: "Checkout - Aira",
};

export default async function Page() {
  const session = await getServerSession(true);
  const isLoggedIn = !!session;

  const addresses = isLoggedIn
    ? await db.query.address.findMany({
        where: (address) => eq(address.userId, session.user.id),
      })
    : null;

  return (
    <Container className="px-2 py-10">
      <ModernCheckout session={session} addresses={addresses} isLoggedIn={isLoggedIn} />
    </Container>
  );
}
