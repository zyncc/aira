"use client";

import ContactModal from "@/components/contact-modal";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-background flex min-h-screen w-full items-center justify-center p-4">
      <div className="mx-auto max-w-2xl space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-primary text-8xl font-bold select-none md:text-9xl">404</h1>
          <div className="space-y-2">
            <h2 className="text-foreground text-3xl font-bold md:text-4xl">
              Page Not Found
            </h2>
            <p className="text-muted-foreground mx-auto max-w-md text-lg">
              Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have
              been moved, deleted, or you entered the wrong URL.
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild size="lg" className="min-w-[140px]">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => window.history.back()}
            className="bg-background text-foreground min-w-[140px]"
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
