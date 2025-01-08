import React from "react";
import InfiniteLoader from "../infiniteLoader";
import Image from "next/image";
import Link from "next/link";
import { Box, Package, Search, ShoppingBag } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import prisma from "@/lib/prisma";
import formatCurrency from "@/lib/formatCurrency";

export const revalidate = 0;

export default async function Page() {
  // await new Promise((resolve) =>
  //   setTimeout((resolve) => {
  //     resolve;
  //   }, 3)
  // );
  const orders = await prisma.order.findMany({
    include: {
      product: true,
      address: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <div className="min-h-screen bg-gray-50/40">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Your Orders</h1>
            <p className="text-muted">Track, review, and manage your orders</p>
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
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              All Orders
            </TabsTrigger>
            <TabsTrigger
              value="not-shipped"
              className="flex items-center gap-2"
            >
              <Box className="h-4 w-4" />
              Not Yet Shipped
            </TabsTrigger>
            <TabsTrigger value="delivered" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Delivered
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-wrap items-start justify-between gap-4 border-b pb-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            ORDER PLACED
                          </span>
                          <span className="text-sm text-muted">
                            {new Date(order.createdAt).toDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">TOTAL</span>
                          <span className="text-sm text-muted">
                            {
                              formatCurrency(
                                order.price * order.quantity
                              ).split(".")[0]
                            }
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">SHIP TO</span>
                          <span className="text-sm text-muted">
                            {order.address.name}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="mb-1 text-sm text-muted">
                          ORDER #{order.orderId}
                        </div>
                        <Link
                          href={`/orders/${order.id}`}
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
                          <p className="text-sm text-muted">
                            Quantity: {order.quantity}
                          </p>
                          <p className="text-sm text-emerald-600">
                            Delivery expected by{" "}
                            {new Date(order.product.createdAt).toDateString()}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button variant="outline" size="sm">
                            <Package className="mr-2 h-4 w-4" />
                            Track Package
                          </Button>
                          <Button variant="outline" size="sm">
                            Write Review
                          </Button>
                          <Button variant="outline" size="sm">
                            Buy Again
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
