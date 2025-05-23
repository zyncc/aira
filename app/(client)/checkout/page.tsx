import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/getServerSession";
import ModernCheckout from "./components/modern-checkout";

export default async function Page() {
  const session = await getServerSession();
  const isLoggedIn = !!session?.session;

  const addresses = isLoggedIn
    ? await prisma.user.findUnique({
        where: {
          id: session?.user.id ?? "",
        },
        include: {
          address: true,
        },
      })
    : null;

  return (
    <section className="container py-10">
      <ModernCheckout addresses={addresses} isLoggedIn={isLoggedIn} />
    </section>
  );
}
