import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import prisma from "@/lib/prisma";
import formatCurrency from "@/lib/formatCurrency";
import { getServerSession } from "@/lib/getServerSession";
import timeAgo from "@/lib/timeAgo";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getServerSession();
  if (session?.user.role !== "admin") {
    redirect("/signin?callbackUrl=/account/orders");
  }

  // await new Promise<void>(
  //   (resolve) =>
  //     setTimeout(() => {
  //       resolve();
  //     }, 3000) // Simulates a 3-second delay
  // );

  const orders = await prisma.order.findMany({
    where: {
      userId: session?.user.id ?? "",
    },
    include: {
      product: true,
      address: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen mt-[100px]">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Your Orders
            </h1>
            <p className="text-muted-foreground">
              Track, review, and manage your orders
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Select defaultValue="last3months">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last30days">Last 30 days</SelectItem>
                <SelectItem value="last3months">Last 3 months</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {orders.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No orders placed</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Add your first shipping address to get started
            </p>
          </div>
        )}
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="overflow-hidden bg-background">
              <CardContent className="p-6">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          ORDER PLACED
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {timeAgo(order.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">TOTAL</span>
                        <span className="text-sm text-muted-foreground">
                          {
                            formatCurrency(order.price * order.quantity).split(
                              "."
                            )[0]
                          }
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">SHIP TO</span>
                        <span className="text-sm text-muted-foreground">
                          {order.address.firstName}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="mb-1 text-sm text-muted-foreground">
                        ORDER #{order.id}
                      </div>
                      <Link
                        href={`/account/orders/${order.id}`}
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        View order details
                      </Link>
                    </div>
                  </div>
                  <div className="flex flex-col gap-6 md:flex-row">
                    <div className="relative aspect-square w-40 overflow-hidden rounded-lg bg-gray-100">
                      <Image
                        src={order.product.images[0]}
                        alt={order.product.title}
                        fill
                        className="object-cover aspect-square"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-4">
                          <h3 className="font-semibold">
                            {order.product.title}
                          </h3>
                          <Badge
                            variant={
                              order.paymentSuccess ? "default" : "destructive"
                            }
                          >
                            {order.paymentSuccess
                              ? "Payment Success"
                              : "Payment Failed"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {order.quantity}
                        </p>
                        <p className="text-sm text-emerald-600">
                          Delivery expected by{" "}
                          {new Date(order.product.createdAt).toDateString()}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {order.paymentSuccess && (
                          <Link href={`/account/orders/${order.id}`}>
                            <Button variant="outline" size="sm">
                              <Package className="mr-2 h-4 w-4" />
                              Track Package
                            </Button>
                          </Link>
                        )}
                        {order.paymentSuccess && (
                          <Button variant="outline" size="sm">
                            Write Review
                          </Button>
                        )}

                        <Link
                          href={`/${order.product.category}/${order.product.id}`}
                        >
                          <Button variant="outline" size="sm">
                            Buy Again
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
