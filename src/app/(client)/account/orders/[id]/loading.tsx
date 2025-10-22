import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/container";
import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";
import ContactModal from "@/components/contact-modal";
import { Button } from "@/components/ui/button";

export default function OrderLoading() {
  return (
    <Container className="bg-background min-h-screen">
      <div className="mx-auto px-2 py-4 sm:px-2 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          {/* Back button skeleton */}
          <Link
            href="/account/orders"
            className="text-muted-foreground hover:text-foreground mb-3 inline-flex items-center text-sm font-medium transition-colors sm:mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Link>

          {/* Header card */}
          <div className="bg-card rounded-[var(--radius)] border p-4 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 sm:gap-6">
              <div className="flex-1">
                <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                  {/* Order ID skeleton */}
                  <Skeleton className="h-8 w-48 sm:h-9" />
                  {/* Status badge skeleton */}
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                {/* Date skeleton */}
                {/*<Skeleton className="mb-3 h-4 w-40" />*/}
                {/* Tracking ID section */}
                <div className="mb-3 flex flex-col gap-2 sm:mb-0 sm:flex-row sm:items-center">
                  <span className="text-muted-foreground text-xs sm:text-sm">
                    Tracking ID:
                  </span>
                  <Skeleton className="h-3 w-32" />
                </div>
                {/* Expected delivery section */}
                <div className="border-t pt-3 sm:border-t-0 sm:pt-0">
                  <Skeleton className="mt-3 h-6 w-40" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content grid */}
        <div className="flex flex-col gap-6 sm:gap-8 lg:grid lg:grid-cols-3">
          {/* Left column - Delivery Progress */}
          <div className="space-y-6 sm:space-y-8 lg:col-span-2">
            <div className="bg-card rounded-[var(--radius)] border p-4 shadow-sm sm:p-6">
              {/* Section title */}
              <h2 className="text-foreground mb-4 text-lg font-semibold sm:mb-6 sm:text-xl">
                Delivery Progress
              </h2>
              {/* Timeline steps */}
              <div className="space-y-4 sm:space-y-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="flex items-start gap-3 sm:gap-4">
                    {/* Step icon skeleton */}
                    <Skeleton className="h-8 w-8 flex-shrink-0 rounded-full sm:h-12 sm:w-12" />
                    {/* Step content */}
                    <div className="min-w-0 flex-1 pt-1 sm:pt-2">
                      <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                      <Skeleton className="mb-2 h-3 w-36" />
                      <Skeleton className="h-3 w-52" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column - Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Shipping Address Card */}
            <div className="bg-card rounded-[var(--radius)] border p-4 shadow-sm sm:p-6">
              {/* Card header */}
              <div className="mb-3 flex items-center gap-3 sm:mb-4">
                <div className="bg-accent/10 rounded-[calc(var(--radius)-4px)] p-1.5 sm:p-2">
                  <MapPin className="text-accent h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <h2 className="text-foreground text-base font-semibold sm:text-lg">
                  Delivery Address
                </h2>
              </div>
              {/* Address content */}
              <div className="space-y-2 sm:space-y-3">
                <Skeleton className="h-4 w-40" />
                <div className="space-y-1">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <div className="border-t pt-2 sm:pt-3">
                  <Skeleton className="h-4 w-36" />
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
