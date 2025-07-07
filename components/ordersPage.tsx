"use client";

import { Loader2, Package, ArrowRight, RefreshCw, MapPin } from "lucide-react";
import type { orderWithAddressProduct } from "@/lib/types";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import timeAgo from "@/lib/timeAgo";
import Link from "next/link";
import formatCurrency from "@/lib/formatCurrency";
import Image from "next/image";
import AddReviewModal from "@/app/(client)/[category]/[id]/components/AddReviewModal";
import type { Session } from "@/auth";

type OrdersResponse = {
  orders: orderWithAddressProduct[];
  nextPage?: number;
};

function OrdersPage({
  orders,
  session,
}: {
  orders: orderWithAddressProduct[];
  session: Session | null;
}) {
  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["infiniteOrders"],
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      queryFn: async ({ pageParam = 1 }) => {
        const res = await fetch(
          `/api/infiniteQuery/accountOrders?page=${pageParam}&userId=${session?.user.id}`
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
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Empty State */}
        {data.pages.length === 0 ||
          (orders.length === 0 && (
            <div className="text-center py-24">
              <div className="w-32 h-32 mx-auto mb-8 bg-secondary rounded-full flex items-center justify-center">
                <Package className="w-16 h-16 text-secondary-foreground" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                No Orders Yet
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                Ready to make your first purchase? Explore our collection and
                find something you love.
              </p>
              <Button size="lg" className="px-8 py-4 text-lg font-semibold">
                <Link href="/shop-all" className="flex items-center gap-2">
                  Start Shopping
                  <ArrowRight className="w-5 h-5" />
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
                className="group overflow-hidden border-0 shadow-none hover:shadow-2xl transition-all duration-300"
              >
                <div className="grid lg:grid-cols-12 gap-0">
                  {/* Product Image */}
                  <div className="lg:col-span-5 relative">
                    <div className="aspect-[4/3] lg:aspect-square relative overflow-hidden">
                      <Link
                        href={`/${order.product.category.replaceAll(" ", "-")}/${order.product.id}`}
                      >
                        <Image
                          src={order.product.images[0] || "/placeholder.svg"}
                          alt={order.product.title}
                          fill
                          placeholder="blur"
                          blurDataURL={order.product.placeholderImages[0]}
                          className="object-cover group-hover:scale-105 transition-transform duration-500 object-top"
                        />
                      </Link>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="lg:col-span-7 p-6 lg:p-8 xl:p-12 flex flex-col justify-between">
                    <div className="space-y-6">
                      {/* Order Header */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Order #{order.id.slice(-8)}
                          </span>
                          <span className="text-xs text-gray-500">
                            {timeAgo(order.createdAt)}
                          </span>
                        </div>
                        <h2 className="text-2xl lg:text-3xl font-black text-gray-900 leading-tight">
                          {order.product.title}
                        </h2>
                      </div>

                      {/* Order Info Grid */}
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                            Quantity
                          </p>
                          <p className="text-lg font-semibold text-gray-900">
                            {order.quantity}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                            Total
                          </p>
                          <p className="text-lg font-semibold text-gray-900">
                            Rs. {formatCurrency(order.price * order.quantity)}
                          </p>
                        </div>
                      </div>

                      {/* Shipping Info */}
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="w-4 h-4 text-gray-600" />
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Shipping To
                          </span>
                        </div>
                        <p className="font-semibold text-gray-900">
                          {order.address.firstName}
                        </p>
                        {order.paymentSuccess && (
                          <p className="text-sm text-green-600 mt-2 font-medium">
                            Expected delivery:{" "}
                            {new Date(
                              new Date(order.createdAt).getTime() +
                                7 * 24 * 60 * 60 * 1000
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
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Button variant="outline" className="w-full" asChild>
                          <Link href={`/account/orders/${order.id}`}>
                            View Details
                            <ArrowRight className="ml-2 w-4 h-4" />
                          </Link>
                        </Button>

                        <Button variant="outline" className="w-full" asChild>
                          <Link
                            href={`/${order.product.category.replaceAll(" ", "-")}/${order.product.id}`}
                          >
                            <RefreshCw className="mr-2 w-4 h-4" />
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
            ))
          )}
        </div>

        {/* Loading More */}
        {hasNextPage && orders.length >= 10 && (
          <div ref={ref} className="flex items-center justify-center pt-16">
            <div className="text-center">
              <Loader2 className="animate-spin w-8 h-8 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 font-medium">
                Loading more orders...
              </p>
            </div>
          </div>
        )}

        {/* End Message */}
        {!hasNextPage && data.pages.some((page) => page.orders.length > 0) && (
          <div className="text-center pt-16 pb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium">That's all your orders!</p>
            <Button
              className="mt-4 bg-black hover:bg-gray-800 text-white font-semibold"
              asChild
            >
              <Link href="/">
                Continue Shopping
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrdersPage;
