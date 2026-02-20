"use client";

import { Container } from "@/components/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FullOrderType } from "@/lib/types";
import { convertImage, formatCurrency, formatSize } from "@/lib/utils";
import { MoveRight, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function OrdersPage({ orders }: { orders: Omit<FullOrderType, "user">[] }) {
  if (orders.length === 0) {
    return (
      <Container className="py-16">
        <div className="flex min-h-100 flex-col items-center justify-center">
          <div className="bg-muted mb-6 flex h-24 w-24 items-center justify-center rounded-full">
            <Package className="text-muted-foreground h-12 w-12" />
          </div>
          <h2 className="mb-2 text-2xl font-bold">No Orders Yet</h2>
          <p className="text-muted-foreground mb-8 max-w-md text-center">
            Ready to make your first purchase? Start exploring our collection today.
          </p>
          <Link href="/shop-all">
            <Button>Start Shopping</Button>
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container className="px-2 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Orders</h1>
        </div>
        <div className="space-y-4">
          {orders.map((order) => (
            <Card
              key={order.id}
              className="overflow-hidden transition-shadow hover:shadow-md"
            >
              <div className="px-4 sm:px-6">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold">Order #{order.id}</h3>
                        <Badge variant={"outline"}>
                          {order.isCod ? "Cash on Delivery" : "Prepaid"}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mt-0.5 text-xs">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="text-muted-foreground text-xs">Order Total</p>
                      <p className="text-lg font-bold">
                        ₹
                        {formatCurrency(
                          order.isCod
                            ? order.totalPrice
                            : order.subtotal - order.discountPrice,
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
                    <div className="space-y-2">
                      <p className="text-muted-foreground text-xs font-medium">
                        SHIPPING TO
                      </p>
                      <div className="space-y-1 text-sm">
                        <p className="text-foreground font-medium">
                          {order.firstName} {order.lastName || ""}
                        </p>
                        <p className="text-muted-foreground line-clamp-1">
                          {order.address1.length > 70
                            ? order.address1.slice(0, 70) + "..."
                            : order.address1}
                        </p>
                        <p className="text-muted-foreground line-clamp-1">
                          {order.phone}
                        </p>
                      </div>
                    </div>
                    {order.ttd && (
                      <div className="space-y-2 text-left md:text-right">
                        <p className="text-muted-foreground text-xs font-medium">
                          ESTIMATED DELIVERY
                        </p>
                        <div className="text-sm">
                          <p className="text-foreground font-medium">
                            {new Date(order.ttd).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              weekday: "short",
                            })}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  <Separator />
                  <div>
                    <p className="text-muted-foreground mb-3 text-xs font-medium">
                      ITEMS ({order.items.length})
                    </p>
                    {order.items.length === 1 &&
                      order.items[0].product.images &&
                      order.items[0].product.images[0] && (
                        <div className="flex items-center justify-between gap-4">
                          <Link
                            href={`/${order.items[0].product.category.replaceAll(
                              " ",
                              "-",
                            )}/${order.items[0].product.id}`}
                            className="bg-muted shrink-0 overflow-hidden rounded-lg transition-opacity hover:opacity-75"
                          >
                            <Image
                              src={convertImage(order.items[0].product.images[0], 300)}
                              alt={order.items[0].product.title}
                              width={80}
                              height={80}
                              className="h-20 w-20 object-cover object-top"
                            />
                          </Link>
                          <div className="flex-1 text-sm">
                            <p className="text-foreground line-clamp-2 font-medium">
                              {order.items[0].product.title}
                            </p>
                            <div className="text-muted-foreground mt-2 space-y-1 text-xs">
                              <p>Qty: {order.items[0].quantity}</p>
                              <p>Size: {formatSize(order.items[0].size)}</p>
                            </div>
                          </div>
                          {(order.isCod || order.paymentSuccess) && (
                            <Link href={`/account/orders/${order.id}`}>
                              <Button variant="outline" size="sm">
                                Tracking <MoveRight />
                              </Button>
                            </Link>
                          )}
                          {!order.isCod && !order.paymentSuccess && (
                            <Badge variant="destructive">Payment not completed</Badge>
                          )}
                        </div>
                      )}
                    {order.items.length > 1 && (
                      <div className="flex items-center gap-3">
                        {order.items.slice(0, 2).map(
                          (item) =>
                            item.product.images &&
                            item.product.images[0] && (
                              <Link
                                key={item.id}
                                href={`/${item.product.category.replaceAll(
                                  " ",
                                  "-",
                                )}/${item.product.id}`}
                                className="bg-muted shrink-0 overflow-hidden rounded-lg transition-opacity hover:opacity-75"
                              >
                                <Image
                                  src={convertImage(item.product.images[0], 300)}
                                  alt={item.product.title}
                                  width={80}
                                  height={80}
                                  className="h-20 w-20 object-cover object-top"
                                />
                              </Link>
                            ),
                        )}
                        {order.items.length > 2 && (
                          <Link href={`/account/orders/${order.id}`}>
                            <div className="border-border flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border border-dashed">
                              <span className="text-muted-foreground text-sm font-medium">
                                +{order.items.length - 2} more
                              </span>
                            </div>
                          </Link>
                        )}
                        {(order.isCod || order.paymentSuccess) && (
                          <div className="ml-auto">
                            <Link href={`/account/orders/${order.id}`}>
                              <Button variant="outline" size="sm">
                                Tracking <MoveRight />
                              </Button>
                            </Link>
                          </div>
                        )}
                        {!order.isCod && !order.paymentSuccess && (
                          <Badge variant="destructive">Payment not completed</Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Container>
  );
}

export default OrdersPage;
