"use client";

import { Loader2, Package } from "lucide-react";
import { orderWithAddressProduct } from "@/lib/types";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import timeAgo from "@/lib/timeAgo";
import Link from "next/link";
import formatCurrency from "@/lib/formatCurrency";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

type OrdersResponse = {
  orders: orderWithAddressProduct[];
  nextPage?: number;
};

function OrdersPage({
  orders,
  userId,
}: {
  orders: orderWithAddressProduct[];
  userId: string;
}) {
  const { ref, inView } = useInView();
  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ["infiniteOrders"],
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    queryFn: async ({ pageParam = 1 }) => {
      const res = await fetch(
        `/api/infiniteQuery/accountOrders?page=${pageParam}&userId=${userId}`
      );
      return (await res.json()) as OrdersResponse;
    },
    initialPageParam: 1,
    initialData: {
      pages: [
        {
          orders,
          nextPage: 2,
        },
      ],
      pageParams: [1],
    },
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
  });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);
  return (
    <>
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
        </div>
        {data.pages.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No orders placed</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Add your first shipping address to get started
            </p>
          </div>
        )}
        <div className="space-y-6">
          {data.pages.map((page, pageIndex) =>
            page.orders.map((order) => (
              <Card
                key={order.id + pageIndex}
                className="overflow-hidden bg-background"
              >
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
                              formatCurrency(
                                order.price * order.quantity
                              ).split(".")[0]
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
                          ORDER #{order.id.slice(-10)}
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
                          placeholder="blur"
                          blurDataURL={order.product.placeholderImages[0]}
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
            ))
          )}
        </div>
        {hasNextPage && (
          <div
            ref={ref}
            className={"w-full flex items-center pt-10 justify-center"}
          >
            <Loader2 className={"animate-spin"} size={35} />
          </div>
        )}
      </div>
    </>
  );
}

export default OrdersPage;
