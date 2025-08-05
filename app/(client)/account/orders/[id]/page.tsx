import Image from "next/image";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import formatCurrency from "@/lib/formatCurrency";
import { capitalizeFirstLetter } from "@/lib/caplitaliseFirstLetter";
import {
  ArrowLeft,
  CheckCircle2,
  MapPin,
  Truck,
  PackageCheck,
  AlertCircle,
  Package,
  Phone,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatSize } from "@/lib/utils";

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
        date: new Date(scan.ScanDetail.ScanDateTime).toLocaleDateString(
          "en-GB",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }
        ),
        location: scan.ScanDetail.ScannedLocation,
        instructions: scan.ScanDetail.Instructions,
      };
    }
  }
  return null;
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      product: true,
      address: true,
    },
  });

  if (!order) {
    return notFound();
  }

  const waybill = order.waybill;
  let TrackingScans: any[] = [];
  let fetchError = false;

  try {
    const res = await fetch(
      `https://track.delhivery.com/api/v1/packages/json/?waybill=${waybill}`,
      {
        headers: {
          Authorization: process.env.DELHIVERY_TOKEN as string,
        },
      }
    );

    const fetchTrackingResponse = await res.json();
    TrackingScans =
      fetchTrackingResponse.ShipmentData?.[0]?.Shipment?.Scans || [];
  } catch (error) {
    console.error("Error fetching tracking data:", error);
    fetchError = true;
  }

  const currentStepIndex = getCurrentStepIndex(TrackingScans);
  const isDelivered = currentStepIndex === ALL_TRACKING_STEPS.length - 1;

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
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link
            href="/account/orders"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-3 sm:mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Link>

          <div className="bg-card rounded-[var(--radius)] border p-4 sm:p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:gap-6">
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                    Order #{order.id.substring(0, 8)}
                  </h1>
                  <Badge
                    variant={isDelivered ? "default" : "secondary"}
                    className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium rounded-[calc(var(--radius)-4px)] self-start ${
                      isDelivered
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {getBadgeText(currentStepIndex)}
                  </Badge>
                </div>
                <p className="text-sm sm:text-base text-muted-foreground mb-3">
                  Placed on{" "}
                  {new Date(order.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                {order.waybill && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3 sm:mb-0">
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      Tracking ID:
                    </span>
                    <code className="text-xs sm:text-sm font-mono bg-muted px-2 py-1 rounded-[calc(var(--radius)-8px)] break-all">
                      {order.waybill}
                    </code>
                  </div>
                )}
                {order.ttd && (
                  <div className="text-left sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0">
                    <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                      Expected Delivery
                    </p>
                    <p className="text-base sm:text-lg font-semibold text-foreground">
                      {new Date(order.ttd).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {fetchError && (
          <div className="mb-6 sm:mb-8 bg-destructive/10 border border-destructive/20 rounded-[var(--radius)] p-3 sm:p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-destructive">
                Unable to fetch latest tracking information. Please check back
                later.
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Tracking Timeline */}
            <div className="bg-card rounded-[var(--radius)] border p-4 sm:p-6 shadow-sm">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-4 sm:mb-6">
                Delivery Progress
              </h2>

              {/* Timeline */}
              <div className="relative">
                <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-0.5 bg-border" />
                <div
                  className="absolute left-4 sm:left-6 top-0 w-0.5 bg-primary transition-all duration-1000 ease-out"
                  style={{
                    height:
                      currentStepIndex >= 0
                        ? `${((currentStepIndex + 1) / steps.length) * 100}%`
                        : "0%",
                  }}
                />

                <div className="space-y-4 sm:space-y-6">
                  {steps.map((step, index) => {
                    const StepIcon = step.icon;
                    const { isCompleted, isCurrent, isFuture } = step;

                    return (
                      <div
                        key={step.id}
                        className="flex items-start gap-3 sm:gap-4 relative"
                      >
                        <div
                          className={`relative flex items-center justify-center w-8 h-8 sm:w-12 sm:h-12 rounded-full border-2 transition-all duration-300 flex-shrink-0 ${
                            isCompleted
                              ? "bg-primary border-primary text-primary-foreground shadow-lg"
                              : isCurrent
                                ? "bg-card border-primary text-primary ring-2 sm:ring-4 ring-primary/20 shadow-lg"
                                : "bg-muted border-border text-muted-foreground"
                          }`}
                        >
                          <StepIcon className="h-3 w-3 sm:h-5 sm:w-5" />
                        </div>
                        <div className="flex-1 pt-1 sm:pt-2 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 mb-1">
                            <h3
                              className={`font-semibold text-sm sm:text-base transition-colors duration-300 ${
                                isCompleted || isCurrent
                                  ? "text-foreground"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {step.name}
                            </h3>
                            <span
                              className={`text-xs sm:text-sm transition-colors duration-300 flex-shrink-0 ${
                                isCompleted || isCurrent
                                  ? "text-muted-foreground"
                                  : "text-muted-foreground/60"
                              }`}
                            >
                              {step.date}
                            </span>
                          </div>
                          <p
                            className={`text-xs sm:text-sm transition-colors duration-300 ${
                              isCompleted || isCurrent
                                ? "text-muted-foreground"
                                : "text-muted-foreground/60"
                            }`}
                          >
                            {step.description}
                          </p>
                          {step.location && (
                            <p
                              className={`text-xs mt-1 transition-colors duration-300 break-words ${
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
            <div className="bg-card rounded-[var(--radius)] border p-4 sm:p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <div className="p-1.5 sm:p-2 bg-accent/10 rounded-[calc(var(--radius)-4px)]">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                </div>
                <h2 className="text-base sm:text-lg font-semibold text-foreground">
                  Delivery Address
                </h2>
              </div>
              <div className="space-y-2 sm:space-y-3">
                <div>
                  <p className="font-medium text-sm sm:text-base text-foreground">
                    {order.address.firstName} {order.address.lastName}
                  </p>
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground space-y-1">
                  <p>{order.address.address1}</p>
                  {order.address.address2 && <p>{order.address.address2}</p>}
                  <p>
                    {order.address.state}, {order.address.zipcode}
                  </p>
                  {order.address.landmark && (
                    <p>Landmark: {order.address.landmark}</p>
                  )}
                </div>
                <div className="pt-2 sm:pt-3 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-medium text-foreground break-all">
                      {order.address.phone}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-secondary/20 rounded-[var(--radius)] border border-secondary/30 p-4 sm:p-6">
              <h3 className="font-semibold text-sm sm:text-base text-foreground mb-2">
                Need Help?
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                Have questions about your order? We're here to help.
              </p>
              <Link href={"/contact"}>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-transparent text-xs sm:text-sm"
                >
                  Contact Support
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
