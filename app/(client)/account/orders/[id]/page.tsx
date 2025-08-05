import Image from "next/image";
import { notFound } from "next/navigation";
import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";
import formatCurrency from "@/lib/formatCurrency";
import { capitalizeFirstLetter } from "@/lib/caplitaliseFirstLetter";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  MapPin,
  Package2,
  Truck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { formatSize } from "@/lib/utils";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  const getOrder = unstable_cache(
    () => {
      return prisma.order.findUnique({
        where: { id },
        include: {
          product: true,
          address: true,
        },
      });
    },
    ["updatedOrderStatus"],
    { revalidate: 60 }
  );

  const order = await getOrder();
  if (!order) {
    return notFound();
  }

  const steps = [
    { name: "Order Placed", icon: CheckCircle2, date: "Feb 1, 2025" },
    { name: "Processing", icon: CheckCircle2, date: "Feb 2, 2025" },
    { name: "Shipped", icon: CheckCircle2, date: "Feb 3, 2025" },
    { name: "Out for Delivery", icon: Truck, date: "Feb 5, 2025" },
    { name: "Delivered", icon: Clock, date: "Expected Feb 5, 2025" },
  ];

  const currentStep = 3;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/account/orders"
          className="inline-flex items-center text-sm font-medium text-primary hover:underline mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Link>

        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">
                Order #{order.id.substring(0, 8)}
              </h1>
              <p className="text-muted-foreground mt-1">
                Placed on February 1, 2025
              </p>
            </div>
            <Badge
              variant="outline"
              className="px-3 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary border-primary/20"
            >
              {steps[currentStep].name}
            </Badge>
          </div>
          <div className="rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-6">Delivery Status</h2>
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />
              <div
                className="absolute left-6 top-0 w-0.5 bg-primary transition-all duration-1000 ease-in-out"
                style={{
                  height: `${(currentStep / (steps.length - 1)) * 100}%`,
                }}
              />
              <div className="space-y-8">
                {steps.map((step, index) => {
                  const StepIcon = step.icon;
                  const isCompleted = index < currentStep;
                  const isCurrent = index === currentStep;

                  return (
                    <div
                      key={step.name}
                      className="flex items-start gap-4 relative"
                    >
                      <div
                        className={`relative flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                          isCompleted
                            ? "bg-primary border-primary text-white"
                            : isCurrent
                              ? "bg-white border-primary text-primary"
                              : "bg-white border-gray-200 text-gray-400"
                        }`}
                      >
                        <StepIcon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 pt-1">
                        <h3
                          className={`font-medium ${isCompleted || isCurrent ? "text-foreground" : "text-muted-foreground"}`}
                        >
                          {step.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {step.date}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 h-fit rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold mb-6">Product Details</h2>
              <div className="flex flex-col sm:flex-row gap-6 flex-1 items-start">
                <div className="relative h-40 w-40 overflow-hidden rounded-lg flex-shrink-0">
                  <Image
                    src={order.product.images[0]}
                    placeholder="blur"
                    priority
                    height={160}
                    width={160}
                    blurDataURL={order.product.placeholderImages[0]}
                    fetchPriority="low"
                    alt={order.product.title}
                    className="object-cover object-top"
                  />
                </div>
                <div className="flex-1 w-full space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold">
                      {order.product.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {capitalizeFirstLetter(order.product.category)}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Size:</span>
                      <span className="text-sm">{formatSize(order.size)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Color:</span>
                      <span className="text-sm">
                        {capitalizeFirstLetter(order.product.color)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Quantity:</span>
                      <span className="text-sm">{order.quantity}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Price:</span>
                      <span className="text-sm">
                        Rs. {formatCurrency(order.price)}
                      </span>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total</span>
                      <span className="text-xl font-bold">
                        Rs. {formatCurrency(order.price * order.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Details */}
            <div className="space-y-6">
              <div className="rounded-xl shadow-sm border p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Package2 className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Order Information</h2>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Order ID
                    </span>
                    <span className="text-sm font-medium">
                      {order.id.substring(0, 8)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Order Date
                    </span>
                    <span className="text-sm font-medium">
                      {new Date(order.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Expected Delivery
                    </span>
                    {order.ttd ? (
                      <span className="text-sm font-medium">
                        {new Date(order.ttd).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="rounded-xl shadow-sm border p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Shipping Address</h2>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="font-medium">
                    {order.address.firstName} {order.address.lastName}
                  </p>
                  <p>{order.address.address1}</p>
                  {order.address.address2 && <p>{order.address.address2}</p>}
                  <p>
                    {order.address.state}, {order.address.zipcode}
                  </p>
                  {order.address.landmark && (
                    <p>Landmark: {order.address.landmark}</p>
                  )}
                  <p className="mt-2 pt-2 border-t">
                    <span className="font-medium">Phone:</span>{" "}
                    {order.address.phone}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
