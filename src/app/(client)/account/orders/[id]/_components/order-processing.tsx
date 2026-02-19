"use client";

import ContactModal from "@/components/contact-modal";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Hourglass } from "lucide-react";
import Link from "next/link";

export default function OrderProcessing() {
  return (
    <div className="bg-background flex min-h-screen w-full items-center justify-center p-4">
      <div className="mx-auto max-w-2xl space-y-8 text-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Hourglass className="size-10" />
          <div className="space-y-2">
            <h2 className="text-foreground text-3xl font-bold md:text-4xl">
              Order Processing
            </h2>
            <p className="text-muted-foreground mx-auto max-w-md text-lg">
              Sorry, your order is still being processed. Please check back later.
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/">
            <Button size="lg" className="min-w-35">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Button>
          </Link>
          <Button
            variant="outline"
            size="lg"
            onClick={() => window.history.back()}
            className="bg-background text-foreground min-w-35"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>

        <div className="border-border border-t pt-8">
          <p className="text-muted-foreground text-sm">
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
