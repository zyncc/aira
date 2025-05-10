"use client";

import { capitalizeFirstLetter } from "@/lib/caplitaliseFirstLetter";
import { orderWithProduct } from "@/lib/types";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Package, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import formatCurrency from "@/lib/formatCurrency";

type Props = {
  orderItems: orderWithProduct[];
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
  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 4.99;
  const total = subtotal + shipping;
  return (
    <div>
      <div className="mb-10 flex flex-col items-center justify-center text-center">
        <motion.div
          className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2, // Slightly delayed to start after the background appears
            }}
          >
            <Check className="h-12 w-12 text-green-600" />
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h1 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl">
            Thank you for your order!
          </h1>
          <p className="text-muted">#{orderId} has been placed successfully.</p>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="mb-6 overflow-hidden border-none shadow-md">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-2 text-sm font-medium text-green-600">
              <Package className="h-4 w-4" />
              <span>Order Confirmed</span>
            </div>

            <div className="mb-6 flex flex-col gap-1">
              <p className="text-sm text-muted">
                We've sent a confirmation email to your email address.
              </p>
              <div className="flex items-center gap-2 text-sm text-muted">
                <Truck className="h-4 w-4" />
                <span>Estimated delivery: 3-5 business days</span>
              </div>
            </div>
            <Separator className="mb-6" />
            <div className="mb-4 flex justify-between">
              <h3 className="font-medium">Order Summary</h3>
              <button
                onClick={() => setShowOrderDetails(!showOrderDetails)}
                className="flex items-center gap-1 text-sm font-medium text-primary"
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
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="mb-6"
              >
                <div className="space-y-4">
                  {orderItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between gap-4 text-sm"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{item.product.title}</p>
                        <p className="text-muted">
                          {capitalizeFirstLetter(item.product.color)} /{" "}
                          {sizeMap[item.size]} / Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">
                        Rs. {formatCurrency(item.price)}
                      </p>
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted">Subtotal</span>
                    <span>Rs. {formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Shipping</span>
                    <span>Rs. {formatCurrency(0)}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>Rs. {formatCurrency(total)}</span>
                  </div>
                </div>
              </motion.div>
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
        <div className="text-center text-sm text-muted">
          <p>
            Need help?{" "}
            <Link
              href="/contact"
              className="font-medium text-primary hover:underline"
            >
              Contact our support team
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
