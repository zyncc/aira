/* eslint-disable @typescript-eslint/no-explicit-any */
import ContactModal from "@/components/contact-modal";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { db } from "@/db/instance";
import { getServerSession } from "@/functions/auth/get-server-session";
import { convertImage, formatCurrency, formatSize } from "@/lib/utils";
import {
  CheckCircle2,
  MapPin,
  Package,
  PackageCheck,
  Phone,
  RefreshCcw,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { forbidden, notFound, redirect } from "next/navigation";
import OrderProcessing from "./_components/order-processing";
import ReturnSheet from "./_components/return-sheet";

// Define all possible tracking steps in order
const ALL_TRACKING_STEPS = [
  {
    id: "manifested",
    name: "Order Confirmed",
    description: "Order created and confirmed",
    icon: CheckCircle2,
    scanTypes: ["Manifested"],
  },
  {
    id: "not-picked",
    name: "Awaiting Pickup",
    description: "Waiting for pickup",
    icon: Package,
    scanTypes: ["Not Picked"],
  },
  {
    id: "in-transit",
    name: "In Transit",
    description: "Moving to destination",
    icon: Truck,
    scanTypes: ["In Transit"],
  },
  {
    id: "pending",
    name: "At Destination",
    description: "Preparing for delivery",
    icon: MapPin,
    scanTypes: ["Pending"],
  },
  {
    id: "dispatched",
    name: "Out for Delivery",
    description: "On the way to you",
    icon: Truck,
    scanTypes: ["Dispatched"],
  },
  {
    id: "delivered",
    name: "Delivered",
    description: "Successfully delivered",
    icon: PackageCheck,
    scanTypes: ["Delivered"],
  },
];

function getBadgeText(currentStepIndex: number) {
  if (currentStepIndex === -1) return "Processing";
  return ALL_TRACKING_STEPS[currentStepIndex]?.name || "Processing";
}

function getCurrentStepIndex(trackingScans: any[]) {
  if (trackingScans.length === 0) return -1;

  const scanTypes = trackingScans.map((scan: any) => scan.ScanDetail.Scan);
  let currentStepIndex = -1;

  for (let i = ALL_TRACKING_STEPS.length - 1; i >= 0; i--) {
    const step = ALL_TRACKING_STEPS[i];
    if (step.scanTypes.some((scanType) => scanTypes.includes(scanType))) {
      currentStepIndex = i;
      break;
    }
  }

  return currentStepIndex;
}

function getStepScanData(trackingScans: any[], stepScanTypes: string[]) {
  for (let i = trackingScans.length - 1; i >= 0; i--) {
    const scan = trackingScans[i];
    if (stepScanTypes.includes(scan.ScanDetail.Scan)) {
      return {
        date: new Date(scan.ScanDetail.ScanDateTime).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        location: scan.ScanDetail.ScannedLocation,
        instructions: scan.ScanDetail.Instructions,
      };
    }
  }
  return null;
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
  // await sleep(5)
  const params = await props.params;
  const { id } = params;

  const session = await getServerSession();

  if (!session) {
    return redirect(`/signin?callbackUrl=/account/orders/${id}`);
  }

  const order = await db.query.order.findFirst({
    where: (order, o) => o.eq(order.id, id),
    with: {
      items: {
        with: {
          product: true,
        },
      },
      returns: true,
    },
  });

  if (!order || !order.paymentSuccess) {
    return notFound();
  }

  if (order.userId !== session.user.id) {
    forbidden();
  }

  const waybill = order.waybill;
  if ((order.isCod && !order.isCodApproved) || !waybill) {
    return <OrderProcessing />;
  }

  let TrackingScans: any[] = [];
  let LastStatus;

  try {
    const res = await fetch(
      `https://track.delhivery.com/api/v1/packages/json/?waybill=${waybill}`,
      {
        headers: {
          Authorization: process.env.DELHIVERY_TOKEN as string,
        },
      },
    );

    const fetchTrackingResponse = await res.json();
    LastStatus = fetchTrackingResponse.ShipmentData?.[0]?.Shipment?.Status;
    TrackingScans = fetchTrackingResponse.ShipmentData?.[0]?.Shipment?.Scans || [];
  } catch (error) {
    console.error("Error fetching tracking data:", error);
  }

  const currentStepIndex = getCurrentStepIndex(TrackingScans);
  const isDelivered = LastStatus.Status == "Delivered";
  const deliveryDate = new Date(LastStatus.StatusDateTime);
  const now = new Date();

  const diffMs = now.getTime() - deliveryDate.getTime();

  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  const inReturnWindow = isDelivered && diffDays <= 7;

  const steps = ALL_TRACKING_STEPS.map((step, index) => {
    const isCompleted = index <= currentStepIndex;
    const isCurrent = index === currentStepIndex;
    const isFuture = index > currentStepIndex;
    const scanData = getStepScanData(TrackingScans, step.scanTypes);

    return {
      ...step,
      isCompleted,
      isCurrent,
      isFuture,
      date:
        scanData?.date ||
        (index === 0
          ? new Date(order.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "Pending"),
      location: scanData?.location,
      instructions: scanData?.instructions,
    };
  });

  return (
    <Container className="bg-background min-h-screen">
      <div className="mx-auto px-2 py-4 sm:px-2 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Card className="overflow-hidden transition-shadow hover:shadow-md">
            <div className="px-4 sm:px-6">
              <div className="flex w-full flex-col gap-4">
                <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                  <div>
                    <h3 className="text-base font-semibold">Order #{order.orderId}</h3>
                    <p className="text-muted-foreground mt-0.5 text-xs">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
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
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="mb-4 flex items-center justify-between gap-4"
                    >
                      <Link
                        href={`/${item.product.category.replaceAll(
                          " ",
                          "-",
                        )}/${order.items[0].product.id}`}
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
                      <div className="w-full flex-1 text-sm">
                        <div className="flex w-full justify-between gap-x-3">
                          <p className="text-foreground line-clamp-2 font-medium">
                            {item.product.title}
                          </p>
                          <h4 className="font-medium whitespace-nowrap">
                            ₹{formatCurrency(item.itemPrice * item.quantity)}
                          </h4>
                        </div>
                        <div className="text-muted-foreground mt-2 space-y-1 text-xs">
                          <p>Qty: {item.quantity}</p>
                          <p>Size: {formatSize(item.size)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex w-full">
                  <div className="w-full rounded-lg text-sm">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium whitespace-nowrap">
                          ₹{formatCurrency(order.subtotal)}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className="font-medium">
                          {order.isCod ? (
                            <span className="whitespace-nowrap text-red-500">
                              + ₹{formatCurrency(order.isCod ? order.shippingPrice : 0)}
                            </span>
                          ) : (
                            <span className="text-green-600">Free</span>
                          )}
                        </span>
                      </div>

                      {order.couponCode && (
                        <div className="flex justify-between">
                          <span>Coupon Discount ({order.couponCode})</span>
                          <span className="font-medium whitespace-nowrap text-green-600">
                            - ₹{formatCurrency(order.discountPrice)}
                          </span>
                        </div>
                      )}

                      {/*<Separator className="my-3" />*/}

                      <div className="flex justify-between text-base font-semibold">
                        <span>Total</span>
                        <span className="whitespace-nowrap">
                          ₹{formatCurrency(order.totalPrice)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
        <div className="flex flex-col gap-6 sm:gap-8 lg:grid lg:grid-cols-3">
          <div className="space-y-6 sm:space-y-8 lg:col-span-2">
            <div className="bg-card border-muted rounded-[var(--radius)] border p-4 shadow-sm sm:p-6">
              <h2 className="text-foreground mb-4 text-lg font-semibold sm:mb-6 sm:text-xl">
                Delivery Progress
              </h2>
              <div className="relative">
                <div className="bg-border absolute top-0 bottom-0 left-4 w-0.5 sm:left-6" />
                <div
                  className="bg-primary absolute top-0 left-4 w-0.5 transition-all duration-1000 ease-out sm:left-6"
                  style={{
                    height:
                      currentStepIndex >= 0
                        ? `${((currentStepIndex + 1) / steps.length) * 100}%`
                        : "0%",
                  }}
                />
                <div className="space-y-4 sm:space-y-6">
                  {steps.map((step) => {
                    const StepIcon = step.icon;
                    const { isCompleted, isCurrent } = step;
                    return (
                      <div
                        key={step.id}
                        className="relative flex items-start gap-3 sm:gap-4"
                      >
                        <div
                          className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 sm:h-12 sm:w-12 ${
                            isCompleted
                              ? "bg-primary border-primary text-primary-foreground shadow-lg"
                              : isCurrent
                                ? "bg-card border-primary text-primary ring-primary/20 shadow-lg ring-2 sm:ring-4"
                                : "bg-muted border-border text-muted-foreground"
                          }`}
                        >
                          <StepIcon className="h-3 w-3 sm:h-5 sm:w-5" />
                        </div>
                        <div className="min-w-0 flex-1 pt-1 sm:pt-2">
                          <div className="mb-1 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
                            <h3
                              className={`text-sm font-semibold transition-colors duration-300 sm:text-base ${
                                isCompleted || isCurrent
                                  ? "text-foreground"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {step.name}
                            </h3>
                            <span
                              className={`shrink-0 text-xs transition-colors duration-300 sm:text-sm ${
                                isCompleted || isCurrent
                                  ? "text-muted-foreground"
                                  : "text-muted-foreground/60"
                              }`}
                            >
                              {step.date}
                            </span>
                          </div>
                          <p
                            className={`text-xs transition-colors duration-300 sm:text-sm ${
                              isCompleted || isCurrent
                                ? "text-muted-foreground"
                                : "text-muted-foreground/60"
                            }`}
                          >
                            {step.description}
                          </p>
                          {step.location && (
                            <p
                              className={`mt-1 text-xs break-words transition-colors duration-300 ${
                                isCompleted || isCurrent
                                  ? "text-muted-foreground/80"
                                  : "text-muted-foreground/40"
                              }`}
                            >
                              📍 {step.location}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Shipping Address */}
            <div className="bg-card border-muted rounded-[var(--radius)] border p-4 shadow-sm sm:p-6">
              <div className="mb-3 flex items-center gap-3 sm:mb-4">
                <div className="bg-accent/10 rounded-[calc(var(--radius)-4px)] p-1.5 sm:p-2">
                  <MapPin className="text-accent h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <h2 className="text-foreground text-base font-semibold sm:text-lg">
                  Delivery Address
                </h2>
              </div>
              <div className="space-y-2 sm:space-y-3">
                <div>
                  <p className="text-foreground text-sm font-medium sm:text-base">
                    {order.firstName} {order.lastName}
                  </p>
                </div>
                <div className="text-muted-foreground space-y-1 text-xs sm:text-sm">
                  <p>{order.address1}</p>
                  {order.address2 && <p>{order.address2}</p>}
                  <p>
                    {order.state}, {order.zipcode}
                  </p>
                </div>
                <div className="border-border border-t pt-2 sm:pt-3">
                  <div className="flex items-center gap-2">
                    <Phone className="text-muted-foreground h-3 w-3 shrink-0 sm:h-4 sm:w-4" />
                    <span className="text-foreground text-xs font-medium break-all sm:text-sm">
                      {order.phone}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {inReturnWindow ? (
              <Card className="w-full gap-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="bg-accent/10 rounded-lg p-2">
                      <RefreshCcw className="text-accent h-5 w-5" />
                    </div>
                    Exchange or Return
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <ReturnSheet order={order} />
                </CardContent>
              </Card>
            ) : null}

            {/* Help Section */}
            <div className="bg-secondary/20 border-secondary/30 rounded-[var(--radius)] border p-4 sm:p-6">
              <h3 className="text-foreground mb-2 text-sm font-semibold sm:text-base">
                Need Help?
              </h3>
              <p className="text-muted-foreground mb-3 text-xs sm:mb-4 sm:text-sm">
                Have questions about your order? We&apos;re here to help.
              </p>
              <ContactModal>
                <Button variant={"link"} className="px-1">
                  Contact Support
                </Button>
              </ContactModal>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
