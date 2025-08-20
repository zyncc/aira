"use client";

import { Session } from "@/auth/server";
import AddReviewModal from "@/components/add-review-modal";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import timeAgo from "@/lib/time-ago";
import { FullOrderType } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ArrowRight, Loader2, MapPin, Package, RefreshCw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

type OrdersResponse = {
  orders: Omit<FullOrderType, "user" | "tracking">[];
  nextPage?: number;
};

function OrdersPage({
  orders,
  session,
}: {
  orders: Omit<FullOrderType, "user" | "tracking">[];
  session: Session;
}) {
  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["infiniteOrders"],
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    queryFn: async ({ pageParam = 1 }) => {
      const res = await fetch(
        `/api/infiniteQuery/accountOrders?page=${pageParam}&userId=${session.user.id}`,
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
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <Container className="min-h-screen">
      <div className="mx-auto px-2 py-12">
        {/* Empty State */}
        {data.pages.length === 0 ||
          (orders.length === 0 && (
            <div className="py-24 text-center">
              <div className="bg-secondary mx-auto mb-8 flex h-32 w-32 items-center justify-center rounded-full">
                <Package className="text-secondary-foreground h-16 w-16" />
              </div>
              <h2 className="mb-4 text-3xl font-bold text-gray-900">No Orders Yet</h2>
              <p className="mx-auto mb-8 max-w-md text-lg text-gray-600">
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

        {/* Orders Grid */}
        <div className="grid gap-8 lg:gap-12">
          {data.pages.map((page, pageIndex) =>
            page.orders.map((order) => (
              <Card
                key={order.id + pageIndex}
                className="group overflow-hidden border-0 py-0 shadow-none transition-all duration-300 hover:shadow-2xl"
              >
                <div className="grid gap-0 lg:grid-cols-12">
                  {/* Product Image */}
                  <div className="relative lg:col-span-5">
                    <div className="relative aspect-[4/3] overflow-hidden lg:aspect-square">
                      <Link
                        href={`/${order.product.category.replaceAll(" ", "-")}/${order.product.id}`}
                      >
                        <Image
                          src={order.product.images[0]}
                          alt={order.product.title}
                          fill
                          // placeholder="blur"
                          // blurDataURL={order.product.placeholderImages[0]}
                          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        />
                      </Link>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="flex flex-col justify-between p-6 lg:col-span-7 lg:p-8 xl:p-12">
                    <div className="space-y-6">
                      {/* Order Header */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                            Order #{order.id.slice(-8)}
                          </span>
                          <span className="text-xs text-gray-500">
                            {timeAgo(order.createdAt)}
                          </span>
                        </div>
                        <h2 className="text-2xl leading-tight font-black text-gray-900 lg:text-3xl">
                          {order.product.title}
                        </h2>
                      </div>

                      {/* Order Info Grid */}
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <p className="mb-1 text-xs font-bold tracking-wider text-gray-500 uppercase">
                            Quantity
                          </p>
                          <p className="text-lg font-semibold text-gray-900">
                            {order.quantity}
                          </p>
                        </div>
                        <div>
                          <p className="mb-1 text-xs font-bold tracking-wider text-gray-500 uppercase">
                            Total
                          </p>
                          <p className="text-lg font-semibold text-gray-900">
                            Rs. {formatCurrency(order.price * order.quantity)}
                          </p>
                        </div>
                      </div>

                      {/* Shipping Info */}
                      <div className="bg-muted rounded-lg p-4">
                        <div className="mb-2 flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-600" />
                          <span className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                            Shipping To
                          </span>
                        </div>
                        <p className="font-semibold text-gray-900">
                          {order.address.firstName}
                        </p>
                        {order.paymentSuccess && (
                          <p className="mt-2 text-sm font-medium text-green-600">
                            Expected delivery:{" "}
                            {new Date(
                              new Date(order.createdAt).getTime() +
                                7 * 24 * 60 * 60 * 1000,
                            ).toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3 pt-6">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <Button variant="outline" className="w-full" asChild>
                          <Link href={`/account/orders/${order.id}`}>
                            View Details
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>

                        <Button variant="outline" className="w-full" asChild>
                          <Link
                            href={`/${order.product.category.replaceAll(" ", "-")}/${order.product.id}`}
                          >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Buy Again
                          </Link>
                        </Button>
                      </div>

                      {order.paymentSuccess && (
                        <div className="pt-2">
                          <AddReviewModal
                            id={order.productId}
                            session={session}
                            category={order.product.category}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            )),
          )}
        </div>

        {/* Loading More */}
        {hasNextPage && orders.length >= 10 && (
          <div ref={ref} className="flex items-center justify-center pt-16">
            <div className="text-center">
              <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-gray-400" />
              <p className="font-medium text-gray-600">Loading more orders...</p>
            </div>
          </div>
        )}

        {/* End Message */}
        {!hasNextPage && data.pages.some((page) => page.orders.length > 0) && (
          <div className="pt-16 pb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <Package className="h-8 w-8 text-gray-400" />
            </div>
            <p className="font-medium text-gray-600">That&apos;s all your orders!</p>
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
