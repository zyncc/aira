import { Container } from "@/components/container";
import { db } from "@/db/instance";
import { getServerSession } from "@/functions/auth/get-server-session";
import { eq } from "drizzle-orm";
import ModernCheckout from "./_components/checkout";

export default async function Page() {
  const session = await getServerSession();
  const isLoggedIn = !!session?.session;

  const addresses = isLoggedIn
    ? await db.query.address.findMany({
        where: (address) => eq(address.userId, session.user.id),
      })
    : null;

  return (
    <Container className="px-2 py-10">
      <ModernCheckout addresses={addresses} isLoggedIn={isLoggedIn} />
    </Container>
  );
}
