import { Container } from "@/components/container";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import SidebarInsetWrapper from "@/components/ui/sidebar-inset";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { db } from "@/db/instance";
import { convertImage } from "@/lib/convert-image";
import { formatCurrency } from "@/lib/utils";
import _ from "lodash";
import { MapPin } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { OrderCard } from "./_components/order-card";
import TabList from "./_components/tab-list";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    tab?: "addresses" | "orders" | "returns";
  }>;
};

function generateLinks(id: string) {
  return [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Users",
      href: "/admin/users",
    },
    {
      label: id,
      href: `/admin/users/${id}`,
    },
  ];
}

export default async function UserPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { tab } = await searchParams;
  const user = await db.query.user.findFirst({
    where: (user, o) => o.eq(user.id, id),
    with: {
      addresses: true,
      orders: {
        orderBy(fields, operators) {
          return operators.desc(fields.createdAt);
        },
      },
      returns: {
        orderBy(fields, operators) {
          return operators.desc(fields.createdAt);
        },
      },
    },
  });

  if (!user) {
    return notFound();
  }

  const addresses = user.addresses;
  const orders = user.orders;
  const returns = user.returns;

  return (
    <div className="w-full overflow-hidden">
      <SidebarInsetWrapper links={generateLinks(id)} />
      <div className="flex w-full flex-1 flex-col items-center justify-center p-4 pt-0">
        <div className="flex flex-col items-center space-x-4">
          <Avatar className="size-20">
            <AvatarImage src={user.image as string} className="object-cover" />
            <AvatarFallback>{user.name[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center space-y-2 text-center">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground text-sm">
              {user.email}{" "}
              <Badge
                className="uppercase"
                variant={user.emailVerified ? "default" : "destructive"}
              >
                {user.emailVerified ? "Verified" : "Unverified"}
              </Badge>
            </p>
            {user.phoneNumber && <p>{user.phoneNumber}</p>}
            <p>
              <Badge variant={"secondary"}>₹ {formatCurrency(user.storeCredit)}</Badge>
            </p>
          </div>
        </div>
        <Container className="mt-10 w-full">
          <Tabs defaultValue={tab || "addresses"} className="w-full">
            <div className="flex w-full justify-center">
              <TabList />
            </div>
            <TabsContent value="addresses" className="w-full py-5">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {addresses.length > 0 &&
                  addresses.map((address) => (
                    <div
                      key={address.id}
                      className="flex flex-1 items-start gap-4 rounded-lg border p-4 transition-colors"
                    >
                      <div className="bg-primary/10 hidden h-10 w-10 shrink-0 items-center justify-center rounded-full sm:flex">
                        <MapPin className="text-primary h-5 w-5" />
                      </div>
                      <div>
                        <div className="mt-1 text-sm">
                          <p className="line-clamp-1">{address.firstName}</p>
                          <p className="line-clamp-2">{address.address1}</p>
                          {address.address2 && (
                            <p className="line-clamp-1">{address.address2}</p>
                          )}
                          <p className="line-clamp-1">{address.phone}</p>
                        </div>
                      </div>
                      <div className="flex-1"></div>
                    </div>
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="orders" className="flex w-full justify-center py-5">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {orders.length > 0 &&
                  orders.map((order) => (
                    <div key={order.id} className="w-full">
                      <OrderCard order={order} />
                    </div>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="returns" className="w-full py-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {returns.length > 0 &&
                  returns.map((ret) => (
                    <Card key={ret.id} className="w-full p-0">
                      <CardContent className="flex flex-col p-0">
                        <div className="relative aspect-square">
                          <Image
                            src={convertImage(ret.images[0], 1000)}
                            alt=""
                            className="rounded-t-md object-cover"
                            fill
                          />
                        </div>
                        <div className="flex flex-col gap-3 p-3">
                          <div className="flex items-center gap-x-3">
                            <Badge
                              variant={ret.type === "return" ? "destructive" : "default"}
                            >
                              {_.capitalize(ret.type)}
                            </Badge>
                            <Badge variant={ret.approved ? "default" : "destructive"}>
                              {ret.approved ? "Approved" : "Not Approved"}
                            </Badge>
                            <Badge
                              variant={ret.finalApproved ? "default" : "destructive"}
                            >
                              {ret.finalApproved ? "Final Approved" : "Not Approved"}
                            </Badge>
                          </div>
                          <p className="text-justify">{ret.reason}</p>
                          <p className="font-medium">Order ID: {ret.orderId}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </Container>
      </div>
    </div>
  );
}
