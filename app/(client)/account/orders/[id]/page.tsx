import formatCurrency from "@/lib/formatCurrency";
import { Package2, MapPin, Calendar, IndianRupee } from "lucide-react";
import prisma from "@/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const order = await prisma.order.findUnique({
    where: {
      id,
    },
    include: {
      product: true,
      address: true,
    },
  });
  if (!order) {
    return notFound();
  }
  const steps = [
    "Order Placed",
    "Processing",
    "Shipped",
    "Out for Delivery",
    "Delivered",
  ];
  const currentStep = 3; // This would normally come from your data/API
  const progress = (currentStep / (steps.length - 1)) * 100;
  return (
    <div className="mt-[100px] container bg-gray-50 py-4 md:p-8">
      <div className="mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Order Tracking</h1>

        {/* Order Status */}
        <Card>
          <CardHeader>
            <CardTitle>Delivery Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-8">
              <Progress value={progress} className="h-2" />
              <div className="mt-4 flex justify-between text-sm">
                {steps.map((step, index) => (
                  <div
                    key={step}
                    className={`flex flex-col items-center ${
                      index <= currentStep ? "text-primary" : "text-foreground"
                    }`}
                  >
                    <div className="h-2 w-2 rounded-full bg-current" />
                    <span className="mt-2 text-center text-xs">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-6">
              <div className="relative h-24 w-24 overflow-hidden rounded-lg">
                <Image
                  src={order.product.images[0]}
                  alt="Shoes"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Shoes</h3>
                <div className="mt-1 text-sm text-foreground">
                  <p>Size: MD</p>
                  <p>Color: Black</p>
                  <p>Quantity: 1</p>
                </div>
                <div className="mt-2 flex items-center text-lg font-semibold">
                  <IndianRupee className="h-4 w-4" />
                  6,999
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shipping Details */}
        <Card>
          <CardHeader>
            <CardTitle>Shipping Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-semibold">
                  <MapPin className="h-4 w-4" />
                  Delivery Address
                </div>
                <div className="text-sm text-foreground">
                  <p>Chandan K</p>
                  <p>#61 Kaustubha, 1st floor, 7th main</p>
                  <p>4th Cross Road, Jp Nagar Phase 7 Bob Colony</p>
                  <p>Karnataka, 560078</p>
                  <p>Landmark: Narayana School</p>
                  <p>Phone: 9148106357</p>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-semibold">
                  <Package2 className="h-4 w-4" />
                  Order Info
                </div>
                <div className="text-sm text-foreground">
                  <p>Order ID: cm6gmto5p000347mgyg5y18o6</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Order Date: Jan 28, 2025</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
