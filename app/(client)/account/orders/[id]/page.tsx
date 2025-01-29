import formatCurrency from "@/lib/formatCurrency";
import { Package2, MapPin, Calendar, IndianRupee, Truck } from "lucide-react";
import prisma from "@/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { capitalizeFirstLetter } from "@/lib/caplitaliseFirstLetter";

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
  const currentStep = 4; // This would normally come from your data/API
  const progress = (currentStep / (steps.length - 1)) * 100;
  return (
    <div className="mt-[100px] container bg-gray-50 p-4 md:p-8">
      <div className="mx-auto">
        <h1 className="text-3xl font-bold mb-8">Order Tracking</h1>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Left Column: Product and Order Info */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-6">
                  <div className="relative h-32 w-32 overflow-hidden rounded-lg">
                    <Image
                      src={order.product.images[0]}
                      alt="Shoes"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">Shoes</h3>
                    <div className="mt-2 text-sm text-foreground grid grid-cols-2 gap-2">
                      <p>Size: MD</p>
                      <p>Color: {order.product.color}</p>
                      <p>Quantity: {order.quantity}</p>
                      <p>Category: {capitalizeFirstLetter(order.product.category)}</p>
                    </div>
                    <div className="mt-4 flex items-center text-2xl font-semibold text-foreground">
                      {formatCurrency(order.price).split(".")[0]}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-semibold">
                      <Package2 className="h-4 w-4" />
                      Order Details
                    </div>
                    <div className="text-sm text-foreground">
                      <p>Order ID: {order.id}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="h-4 w-4" />
                        <span>Order Date: {order.createdAt.toDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-semibold">
                      <Truck className="h-4 w-4" />
                      Estimated Delivery
                    </div>
                    <div className="text-sm text-foreground">
                      <p>February 5, 2025</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Delivery Status and Address */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Delivery Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-8">
                  <Progress value={progress} className="h-2 transition-all duration-1000 ease-in-out" />
                  <div className="mt-4 space-y-2">
                    {steps.map((step, index) => (
                      <div
                        key={step}
                        className={`flex items-center gap-2 ${
                          index <= currentStep ? "text-primary" : "text-foreground"
                        }`}
                      >
                        <div className="h-2 w-2 rounded-full bg-current" />
                        <span className="text-sm">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-semibold">
                    <MapPin className="h-4 w-4" />
                    Delivery Address
                  </div>
                  <div className="text-sm text-foreground">
                    <p className="font-medium">Chandan K</p>
                    <p>#61 Kaustubha, 1st floor, 7th main</p>
                    <p>4th Cross Road, Jp Nagar Phase 7 Bob Colony</p>
                    <p>Karnataka, 560078</p>
                    <p>Landmark: Narayana School</p>
                    <p className="mt-2">Phone: 9148106357</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
