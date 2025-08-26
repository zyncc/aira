"use client";

import ContactModal from "@/components/contact-modal";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { OrderWithProduct } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import _ from "lodash";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronUp,
  Clock8,
  Package,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type Props = {
  orderItems: OrderWithProduct[];
};

const sizeMap: Record<string, string> = {
  sm: "Small",
  md: "Medium",
  lg: "Large",
  xl: "Extra Large",
  doublexl: " Double XL",
};

export default function SuccessClient({ orderItems }: Props) {
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    localStorage.removeItem("cart");
  }, []);

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
            #{orderItems[0].waybill ?? orderItems[0].id} has been placed successfully.
          </p>
        </div>
      </div>
      <div>
        <Card className="mb-6 overflow-hidden py-0">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-2 text-sm font-medium text-green-600">
              <Package className="h-4 w-4" />
              <span>Order Confirmed</span>
            </div>

            <div className="mb-6 flex flex-col gap-1">
              <p className="text-muted-foreground text-sm">
                We have received your order, The receipt has been sent to your email
                address and WhatsApp number.
              </p>
              {orderItems[0].paymentSuccess && (
                <Alert variant={"default"} className="mt-3">
                  <Check />
                  <AlertTitle>
                    Payment Status :{" "}
                    <span className="font-medium text-green-700">Success</span>
                  </AlertTitle>
                </Alert>
              )}
              {!orderItems[0].paymentSuccess && (
                <Alert variant={"destructive"} className="border-destructive mt-3">
                  <Clock8 />
                  <AlertTitle>Payment Status : Pending</AlertTitle>
                  <AlertDescription>
                    {" "}
                    It could take some time to confirm the payment, please wait for some
                    time
                  </AlertDescription>
                </Alert>
              )}
              {orderItems[0].ttd && (
                <div className="text-muted-foreground mt-3 flex items-center gap-2 text-sm">
                  <Truck className="h-4 w-4" />
                  <span>
                    Estimated delivery:{" "}
                    {orderItems[0].ttd.toLocaleDateString("en-GB", {
                      dateStyle: "medium",
                      timeZone: "Asia/Kolkata",
                    })}
                  </span>
                </div>
              )}
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
            Need help?
            <ContactModal>
              <Button variant={"link"} className="px-1">
                Contact our support team
              </Button>
            </ContactModal>
          </p>
        </div>
      </div>
    </div>
  );
}
