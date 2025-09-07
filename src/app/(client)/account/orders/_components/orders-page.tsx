"use client";

import { Container } from "@/components/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { convertImage } from "@/lib/convert-image";
import { FullOrderType } from "@/lib/types";
import { formatCurrency, formatSize } from "@/lib/utils";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ArrowRight, Loader2, MapPin, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

type OrdersResponse = {
  orders: Omit<FullOrderType, "user" | "tracking">[];
  nextPage?: number;
};

function OrdersPage({ orders }: { orders: Omit<FullOrderType, "user" | "tracking">[] }) {
  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["infiniteOrders"],
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    queryFn: async ({ pageParam = 1 }) => {
      const res = await fetch(`/api/infinite/account/orders?page=${pageParam}`);
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
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  const infiniteOrders = data.pages.flatMap((orders) => orders.orders);

  return (
    <Container className="min-h-screen">
      <div className="mx-auto px-2 py-2">
        {data.pages.length === 0 ||
          (orders.length === 0 && (
            <div className="py-24 text-center">
              <div className="bg-secondary mx-auto mb-8 flex h-32 w-32 items-center justify-center rounded-full">
                <Package className="text-secondary-foreground h-16 w-16" />
              </div>
              <h2 className="mb-4 text-3xl font-bold text-gray-900">No Orders Yet</h2>
              <p className="text-muted-foreground mx-auto mb-8 max-w-md text-lg">
                Ready to make your first purchase? Explore our collection and find
                something you love.
              </p>
              <Button size="lg" className="px-8 py-4 text-lg font-semibold">
                <Link href="/shop-all" className="flex items-center gap-2">
                  Start Shopping
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          ))}

        <div className="min-h-screen">
          <div className="mx-auto max-w-6xl px-4 py-6">
            <div>
              {data.pages.length === 0 ||
                (orders.length === 0 && (
                  <div className="mb-8">
                    <h2 className="mb-6 text-2xl font-semibold">My Orders</h2>
                  </div>
                ))}
              <div className="space-y-6">
                {infiniteOrders.map((order) => (
                  <Card key={order.id} className="overflow-hidden p-6">
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex w-full items-center justify-between gap-3">
                        <div className="flex items-center gap-x-3">
                          <Package className="text-muted-foreground h-5 w-5" />
                          <span className="font-semibold">#{order.id}</span>
                        </div>
                        <Badge
                          className="hidden md:block"
                          variant={order.paymentSuccess ? "default" : "destructive"}
                        >
                          {order.paymentSuccess ? "Payment Success" : "Payment Failed"}
                        </Badge>
                        <Badge
                          className="block md:hidden"
                          variant={order.paymentSuccess ? "default" : "destructive"}
                        >
                          {order.paymentSuccess ? "Paid" : "Unpaid"}
                        </Badge>
                      </div>
                    </div>
                    <div className="mb-6 grid grid-cols-1 gap-6 text-sm md:grid-cols-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="text-muted-foreground size-4 shrink-0" />
                        <HoverCard>
                          <HoverCardTrigger>
                            <span className="text-muted-foreground text-balance">
                              {order.address1}
                            </span>
                          </HoverCardTrigger>
                          <HoverCardContent className="text-sm text-balance">
                            <p>{order.firstName}</p>
                            <p className="line-clamp-1">{order.email}</p>
                            <p>{order.phone}</p>
                            <p>{order.address1}</p>
                            <p>{order.address2}</p>
                            <p>{order.city}</p>
                            <p>{order.zipcode}</p>
                          </HoverCardContent>
                        </HoverCard>
                      </div>
                      {order.ttd ? (
                        <div className="text-muted-foreground text-center text-balance">
                          Estimated arrival: {order.ttd.toDateString()}
                        </div>
                      ) : null}
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Link
                          href={`/${order.product.category.replaceAll(" ", "-")}/${order.product.id}`}
                        >
                          <Image
                            src={convertImage(order.product.images[0], 200)}
                            alt={order.product.title}
                            width={64}
                            height={64}
                            className="h-16 w-16 rounded-lg object-cover object-top"
                          />
                        </Link>
                        <div className="flex-1">
                          <h4 className="font-medium">{order.product.title}</h4>
                          <p className="text-muted-foreground text-sm">
                            Quantity: {order.quantity}
                          </p>
                          <p className="text-muted-foreground text-sm">
                            {formatSize(order.size)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="border-border mt-6 flex items-center justify-between border-t pt-4">
                      <span className="font-semibold">
                        Total: ₹ {formatCurrency(order.price)}
                      </span>
                      {order.paymentSuccess && (
                        <Link href={`/account/orders/${order.id}`}>
                          <Button variant="outline" size="sm">
                            Tracking <ArrowRight className="size-4" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
        {hasNextPage && orders.length >= 10 && (
          <div ref={ref} className="flex items-center justify-center pt-16">
            <div className="text-center">
              <Loader2 className="text-muted-foreground mx-auto mb-4 h-8 w-8 animate-spin" />
              <p className="text-muted-foreground font-medium">Loading more orders...</p>
            </div>
          </div>
        )}
        {!hasNextPage && data.pages.some((page) => page.orders.length > 0) && (
          <div className="pt-16 pb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <Package className="text-muted-foreground h-8 w-8" />
            </div>
            <p className="text-muted-foreground font-medium">
              That&apos;s all your orders!
            </p>
            <Button
              className="mt-4 bg-black font-semibold text-white hover:bg-gray-800"
              asChild
            >
              <Link href="/">
                Continue Shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </Container>
  );
}

export default OrdersPage;
