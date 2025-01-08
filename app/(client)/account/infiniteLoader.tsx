"use client";

import { InfiniteAccountOrders } from "@/actions/infiniteData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { capitalizeFirstLetter } from "@/lib/caplitaliseFirstLetter";
import formatCurrency from "@/lib/formatCurrency";
import { useInfiniteQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import { CgSpinner } from "react-icons/cg";
import { useInView } from "react-intersection-observer";

export default function InfiniteLoader() {
  const { ref, inView } = useInView();

  const { data, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ["infiniteAccountOrders"],
    queryFn: ({ pageParam = 0 }) => InfiniteAccountOrders(pageParam),
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = lastPage.length ? allPages.length + 1 : undefined;
      return nextPage;
    },
  });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  });

  return (
    <div className="w-full">
      {data?.pages.map((page) => {
        return page.map((order) => (
          <div
            key={order.id}
            className="w-full lg:border-2 border-b-2 border-muted mb-5 flex pb-5 lg:pb-0 lg:rounded-lg"
          >
            <Link href={`/account/orders/${order.id}`}>
              <Image
                src={order.product.images[0]}
                className="object-cover aspect-square rounded-lg lg:rounded-l-lg lg:rounded-r-none"
                width={200}
                height={200}
                alt="Order Image"
                priority
                placeholder="blur"
                blurDataURL={
                  order.product.placeholderImages[0] ??
                  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAAECAIAAADETxJQAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAM0lEQVR4nAEoANf/ALGzrLi+t7a+tgDOzsiViYOaioYAyZ6bNAAApVZXAPbx8PTz8/39+9MaGEV/cIIyAAAAAElFTkSuQmCC"
                }
              />
            </Link>
            <div className="flex flex-col w-full">
              <div className="bg-secondary hidden p-3 lg:flex justify-between gap-x-4">
                <div className="flex gap-x-5">
                  <div>
                    <h1>Order Placed</h1>
                    <h1>{order.createdAt.toDateString()}</h1>
                  </div>
                  <div>
                    <h1>Order Total</h1>
                    <h1 className="font-semibold">
                      {
                        formatCurrency(order.price * order.quantity).split(
                          "."
                        )[0]
                      }
                    </h1>
                  </div>
                  <div>
                    <h1>Ship To</h1>
                    <HoverCard>
                      <HoverCardTrigger>
                        <Badge variant="outline" className="cursor-pointer">
                          <h1 className="text-md">
                            {capitalizeFirstLetter(
                              order.address?.name.toLowerCase() ?? ""
                            )}
                          </h1>
                        </Badge>
                      </HoverCardTrigger>
                      <HoverCardContent className="text-left font-medium">
                        <p className="line-clamp-1">
                          {order.address?.address1}
                        </p>
                        <p className="line-clamp-1">
                          {order.address?.address2}
                        </p>
                        <p>{order.address?.phone}</p>
                        <p>{order.address?.landmark}</p>
                        <p>{order.address?.zipcode}</p>
                      </HoverCardContent>
                    </HoverCard>
                  </div>
                </div>
                <div className="flex flex-col text-right">
                  TXN#{order.orderId}
                  <Link
                    href={`/account/orders/${order.id}`}
                    className="underline underline-offset-2 font-semibold"
                  >
                    Order Details
                  </Link>
                </div>
              </div>
              <div className="px-5 h-full flex justify-between">
                <div className="flex flex-col justify-center">
                  <Link href={`/account/orders/${order.id}`}>
                    <h1 className="font-medium text-lg line-clamp-1 lg:line-clamp-none">
                      {order.product.title}
                    </h1>
                  </Link>
                  <h1 className="text-green-800">
                    Delivery by {order.createdAt.toDateString().slice(0, 10)}
                  </h1>
                  <h1 className="hidden lg:block">Qty - {order.quantity}</h1>
                </div>
                <div className="hidden md:flex flex-col gap-2 items-end justify-center">
                  <Link href={`/account/orders/${order.id}`}>
                    <Button variant={"outline"}>Track Package</Button>
                  </Link>
                  <Link href={`/reviews/add/${order.productId}`}>
                    <Button variant={"outline"}>Write Product Review</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ));
      })}
      {hasNextPage && (
        <div ref={ref} className="w-full flex items-center justify-center">
          <CgSpinner className="animate-spin my-10" size={40} />
        </div>
      )}
    </div>
  );
}
