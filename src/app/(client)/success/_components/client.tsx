"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { OrderWithProduct } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import _ from "lodash";
import { ArrowLeft, Check, ChevronDown, ChevronUp, Package, Truck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type Props = {
  orderItems: OrderWithProduct[];
  orderId: string;
};

const sizeMap: Record<string, string> = {
  sm: "Small",
  md: "Medium",
  lg: "Large",
  xl: "Extra Large",
  doublexl: " Double XL",
};

export default function SuccessClient({ orderItems, orderId }: Props) {
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div>
      <div className="mb-10 flex flex-col items-center justify-center text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
          <div>
            <Check className="h-12 w-12 text-green-600" />
          </div>
        </div>
        <div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl">
            Thank you for your order!
          </h1>
          <p className="text-muted-foreground">
            #{orderId} has been placed successfully.
          </p>
        </div>
      </div>
      <div>
        <Card className="mb-6 overflow-hidden border-none shadow-md">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-2 text-sm font-medium text-green-600">
              <Package className="h-4 w-4" />
              <span>Order Confirmed</span>
            </div>

            <div className="mb-6 flex flex-col gap-1">
              <p className="text-muted-foreground text-sm">
                We&apos;ve sent the receipt to your email address and WhatsApp number.
              </p>
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <Truck className="h-4 w-4" />
                <span>
                  Estimated delivery:{" "}
                  {orderItems[0].ttd?.toLocaleDateString("en-GB", {
                    dateStyle: "medium",
                    timeZone: "Asia/Kolkata",
                  })}
                </span>
              </div>
            </div>
            <Separator className="mb-6" />
            <div className="mb-4 flex justify-between">
              <h3 className="font-medium">Order Summary</h3>
              <button
                onClick={() => setShowOrderDetails(!showOrderDetails)}
                className="text-primary flex items-center gap-1 text-sm font-medium"
              >
                {showOrderDetails ? "Hide details" : "Show details"}
                {showOrderDetails ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
            </div>
            {showOrderDetails && (
              <div className="mb-6">
                <div className="space-y-4">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex justify-between gap-4 text-sm">
                      <div className="flex-1">
                        <p className="font-medium">{item.product.title}</p>
                        <p className="text-muted-foreground">
                          {_.capitalize(item.product.color)} / {sizeMap[item.size]} / Qty:{" "}
                          {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">Rs. {formatCurrency(item.price)}</p>
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>Rs. {formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>Rs. {formatCurrency(0)}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>Rs. {formatCurrency(subtotal)}</span>
                  </div>
                </div>
              </div>
            )}
            <div className="flex flex-col gap-3">
              <Button asChild>
                <Link href="/account/orders">Track Order</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Continue Shopping
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        <div className="text-muted-foreground text-center text-sm">
          <p>
            Need help?{" "}
            <Link href="/contact" className="text-primary font-medium hover:underline">
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
