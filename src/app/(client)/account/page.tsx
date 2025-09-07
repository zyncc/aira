import { Container } from "@/components/container";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db/instance";
import { address, order } from "@/db/schema";
import { getServerSession } from "@/functions/auth/get-server-session";
import timeAgo from "@/lib/time-ago";
import { formatCurrency } from "@/lib/utils";
import { desc, eq, sql } from "drizzle-orm";
import _ from "lodash";
import { MapPin, Package, Wallet } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Account from "./_components/account";

export const metadata: Metadata = {
  title: "Your Account - Aira",
};

const AccountWrapper = async () => {
  const session = await getServerSession(true);

  if (!session) {
    redirect("/signin?callbackUrl=/account");
  }

  const [[orderCount], [addressCount], getActivity] = await Promise.all([
    db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(order)
      .where(eq(order.userId, session.user.id)),

    db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(address)
      .where(eq(address.userId, session.user.id)),

    db.query.activity.findMany({
      where: (activity) => eq(activity.userId, session.user.id),
      orderBy: (activity) => desc(activity.createdAt),
      limit: 5,
    }),
  ]);

  return (
    <>
      <Container className="mx-auto mt-[30px] space-y-8 px-2 py-6">
        <div className="flex flex-col items-center space-y-4 md:flex-row md:justify-start md:space-y-0 md:space-x-6">
          <Avatar className="h-12 w-12 rounded-full">
            <AvatarImage src={session.user.image!} alt={session.user.name} />
            <AvatarFallback className="rounded-full text-xl">
              {session.user.name.slice(0, 1).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-bold">{_.capitalize(session.user.name)}</h1>
            {session.user.role === "admin" && <p className="text-foreground">Admin</p>}
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link href={"/account/orders"}>
            <Card className="bg-background hover:bg-accent/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <Package className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{orderCount.count}</div>
              </CardContent>
            </Card>
          </Link>
          <Link href={"/account/addresses"}>
            <Card className="bg-background hover:bg-accent/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Your Addresses</CardTitle>
                <MapPin className="text-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{addressCount.count}</div>
              </CardContent>
            </Card>
          </Link>
          <Card className="bg-background hover:bg-accent/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Store Credit</CardTitle>
              <Wallet className="text-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹ {formatCurrency(session.user.storeCredit)}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-background md:col-span-2">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {getActivity.map((item, i) => (
                <div key={i} className="flex items-center space-x-4">
                  {item.type === "address" ? (
                    <MapPin className="text-muted-foreground h-4 w-4" />
                  ) : (
                    <Package className="text-muted-foreground h-4 w-4" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm leading-none font-medium">{item.title}</p>
                    <p className="text-muted-foreground text-sm">
                      {timeAgo(item.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
              {getActivity.length == 0 && (
                <div>
                  <h1 className="text-muted-foreground text-base">No recent Activity</h1>
                </div>
              )}
            </CardContent>
          </Card>
          <Account session={session} getActivity={getActivity} />
        </div>
      </Container>
    </>
  );
};

export default AccountWrapper;
