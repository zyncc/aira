/* eslint-disable @typescript-eslint/no-explicit-any */
import ContactModal from "@/components/contact-modal";
import { Container } from "@/components/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { db } from "@/db/instance";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  MapPin,
  Package,
  PackageCheck,
  Phone,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

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
        }),
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

  const order = await db.query.order.findFirst({
    where: (order, o) => o.eq(order.id, id),
    with: {
      product: true,
      address: true,
    },
  });

  if (!order || !order.paymentSuccess) {
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
      },
    );

    const fetchTrackingResponse = await res.json();
    TrackingScans = fetchTrackingResponse.ShipmentData?.[0]?.Shipment?.Scans || [];
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
    <Container className="bg-background min-h-screen">
      <div className="mx-auto px-2 py-4 sm:px-2 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link
            href="/account/orders"
            className="text-muted-foreground hover:text-foreground mb-3 inline-flex items-center text-sm font-medium transition-colors sm:mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Link>

          <div className="bg-card rounded-[var(--radius)] border p-4 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 sm:gap-6">
              <div className="flex-1">
                <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                  <h1 className="text-foreground text-xl font-bold sm:text-2xl lg:text-3xl">
                    Order #{order.id.substring(0, 8)}
                  </h1>
                  <Badge
                    variant={isDelivered ? "default" : "secondary"}
                    className={`self-start rounded-[calc(var(--radius)-4px)] px-2 py-1 text-xs font-medium sm:px-3 sm:py-1.5 sm:text-sm ${
                      isDelivered
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {getBadgeText(currentStepIndex)}
                  </Badge>
                </div>
                <p className="text-muted-foreground mb-3 text-sm sm:text-base">
                  Placed on{" "}
                  {new Date(order.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                {order.waybill && (
                  <div className="mb-3 flex flex-col gap-2 sm:mb-0 sm:flex-row sm:items-center">
                    <span className="text-muted-foreground text-xs sm:text-sm">
                      Tracking ID:
                    </span>
                    <code className="bg-muted w-fit rounded-[calc(var(--radius)-8px)] px-2 py-1 font-mono text-xs break-all sm:text-sm">
                      {order.waybill}
                    </code>
                  </div>
                )}
                {order.ttd && (
                  <div className="border-t pt-3 text-left sm:border-t-0 sm:pt-0 sm:text-right">
                    <p className="text-muted-foreground mb-1 text-xs sm:text-sm">
                      Expected Delivery
                    </p>
                    <p className="text-foreground text-base font-semibold sm:text-lg">
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
          <div className="bg-destructive/10 border-destructive/20 mb-6 rounded-[var(--radius)] border p-3 sm:mb-8 sm:p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-destructive mt-0.5 h-4 w-4 flex-shrink-0 sm:h-5 sm:w-5" />
              <p className="text-destructive text-xs sm:text-sm">
                Unable to fetch latest tracking information. Please check back later.
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-6 sm:gap-8 lg:grid lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 sm:space-y-8 lg:col-span-2">
            {/* Tracking Timeline */}
            <div className="bg-card rounded-[var(--radius)] border p-4 shadow-sm sm:p-6">
              <h2 className="text-foreground mb-4 text-lg font-semibold sm:mb-6 sm:text-xl">
                Delivery Progress
              </h2>

              {/* Timeline */}
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
                          className={`relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 sm:h-12 sm:w-12 ${
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
                              className={`flex-shrink-0 text-xs transition-colors duration-300 sm:text-sm ${
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
            <div className="bg-card rounded-[var(--radius)] border p-4 shadow-sm sm:p-6">
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
                    {order.address.firstName} {order.address.lastName}
                  </p>
                </div>
                <div className="text-muted-foreground space-y-1 text-xs sm:text-sm">
                  <p>{order.address.address1}</p>
                  {order.address.address2 && <p>{order.address.address2}</p>}
                  <p>
                    {order.address.state}, {order.address.zipcode}
                  </p>
                  {order.address.landmark && <p>Landmark: {order.address.landmark}</p>}
                </div>
                <div className="border-border border-t pt-2 sm:pt-3">
                  <div className="flex items-center gap-2">
                    <Phone className="text-muted-foreground h-3 w-3 flex-shrink-0 sm:h-4 sm:w-4" />
                    <span className="text-foreground text-xs font-medium break-all sm:text-sm">
                      {order.address.phone}
                    </span>
                  </div>
                </div>
              </div>
            </div>

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
