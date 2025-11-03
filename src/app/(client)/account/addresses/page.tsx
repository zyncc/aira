import EditAddressButton from "@/app/(client)/account/addresses/_components/editAddressButton";
import { Container } from "@/components/container";
import { db } from "@/db/instance";
import { getServerSession } from "@/functions/auth/get-server-session";
import { MapPin } from "lucide-react";
import { redirect } from "next/navigation";
import CreateNewAddressButton from "./_components/createNewAddressButton";

export default async function Page() {
  // await sleep(3);
  const session = await getServerSession();
  if (!session) {
    return redirect("/signin?callbackUrl=/account/addresses");
  }
  const addresses = await db.query.address.findMany({
    where: (address, o) => o.eq(address.userId, session.user.id),
    orderBy: (address, o) => o.desc(address.createdAt),
  });

  return (
    <Container className="mt-[30px] space-y-8 px-2 py-8">
      <div className="flex items-center justify-between gap-x-4">
        <div>
          <h1 className="text-2xl font-semibold">Addresses</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage your shipping addresses
          </p>
        </div>
        <CreateNewAddressButton />
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {addresses.map((address) => (
          <div
            key={address.id}
            className="flex flex-1 items-start gap-4 rounded-lg border p-4 transition-colors"
          >
            <div className="bg-primary/10 hidden h-10 w-10 flex-shrink-0 items-center justify-center rounded-full sm:flex">
              <MapPin className="text-primary h-5 w-5" />
            </div>
            <div className="">
              <div className="text-muted-foreground mt-1 text-sm">
                <p className="line-clamp-1">{address.firstName}</p>
                <p className="line-clamp-2">{address.address1}</p>
                {address.address2 && <p className="line-clamp-1">{address.address2}</p>}
                <p className="line-clamp-1">{address.phone}</p>
              </div>
            </div>
            <div className="flex-1"></div>
            <div className="flex gap-3">
              <EditAddressButton address={address} />
            </div>
          </div>
        ))}
      </div>
      {addresses.length === 0 && (
        <div className="w-full py-12 text-center">
          <MapPin className="text-muted mx-auto h-12 w-12" />
          <h3 className="mt-4 text-lg font-medium">No addresses found</h3>
          <p className="text-muted mt-1 text-sm">
            Add your first shipping address to get started
          </p>
          <CreateNewAddressButton />
        </div>
      )}
    </Container>
  );
}
