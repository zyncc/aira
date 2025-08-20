"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Shield } from "lucide-react";
import Link from "next/link";

export default function Forbidden() {
  return (
    <div className="bg-background flex min-h-screen w-full items-center justify-center p-4">
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="space-y-4 text-center">
          <div className="bg-destructive/10 mx-auto flex h-20 w-20 items-center justify-center rounded-full">
            <Shield className="text-destructive h-10 w-10" />
          </div>
          <div className="space-y-2">
            <h1 className="text-destructive text-6xl font-bold select-none md:text-7xl">
              403
            </h1>
            <h2 className="text-foreground text-3xl font-bold md:text-4xl">
              Access Forbidden
            </h2>
            <p className="text-muted-foreground mx-auto max-w-md text-lg">
              You don&apos;t have permission to access this resource. This could be due to
              insufficient privileges or restricted content.
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
      </div>
    </div>
  );
}
