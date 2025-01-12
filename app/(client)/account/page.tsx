import { redirect } from "next/navigation";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { capitalizeFirstLetter } from "@/lib/caplitaliseFirstLetter";
import { headers } from "next/headers";
import { auth } from "@/auth";
import { CreditCard, Package, Settings, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import SignOutBtn from "@/components/SignIn/SignOutBtn";
import prisma from "@/lib/prisma";
import timeAgo from "@/lib/timeAgo";

const Account = async () => {
  const session = await auth.api.getSession({
    headers: headers(),
  });
  if (!session?.user) {
    redirect(`/signin?callbackUrl=/account`);
  }
  const [orderCount, addressCount, getActivity] = await Promise.all([
    prisma.order.count({
      where: {
        userId: session.user.id,
        paymentSuccess: true,
      },
    }),
    prisma.address.count({
      where: {
        userId: session.user.id,
      },
    }),
    prisma.activity.findMany({
      where: {
        userId: session.user.id,
      },
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);
  return (
    <div className="container mx-auto p-6 space-y-8  mt-[100px]">
      <div className="flex flex-col items-center space-y-4 md:flex-row md:space-y-0 md:space-x-6 md:justify-start">
        <Image
          alt="Profile picture"
          src={session.user.image || "/user.png"}
          height={60}
          width={60}
          quality={100}
          unoptimized
          className="object-cover rounded-full"
        />
        <div className="text-center md:text-left">
          <h1 className="text-2xl font-bold">
            {capitalizeFirstLetter(session.user.name)}
          </h1>
          {session.user.role === "admin" && (
            <p className="text-muted-foreground">Admin</p>
          )}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href={"/account/orders"}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Orders
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orderCount}</div>
            </CardContent>
          </Card>
        </Link>
        <Link href={"/account/addresses"}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Your Addresses
              </CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{addressCount}</div>
            </CardContent>
          </Card>
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {getActivity.map((item, i) => (
              <div key={i} className="flex items-center space-x-4">
                {item.type === "address" ? (
                  <MapPin className="h-4 w-4 text-muted" />
                ) : (
                  <Package className="h-4 w-4 text-muted" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium leading-none">
                    {item.title}
                  </p>
                  <p className="text-sm text-muted">
                    {timeAgo(item.createdAt)}
                  </p>
                </div>
              </div>
            ))}
            {getActivity.length == 0 && (
              <div>
                <h1 className="text-base text-muted">No recent Activity</h1>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick Settings</CardTitle>
            <CardDescription>Manage your preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications">Email Notifications</Label>
              <Switch id="notifications" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="marketing">Marketing emails</Label>
              <Switch id="marketing" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="updates">Product updates</Label>
              <Switch id="updates" />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex justify-between items-center pt-6">
        <SignOutBtn />
      </div>
    </div>
  );
};

export default Account;
