"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Frown, ArrowLeft, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <Frown className="w-24 h-24 text-gray-400 mb-8 animate-pulse" />
      <h1 className="text-4xl font-bold text-gray-800 mb-3 text-center">
        Oops! Something's not right
      </h1>
      <p className="text-xl text-gray-600 mb-8 text-center max-w-md">
        We're having trouble loading this page. Our team has been notified and
        is working on it.
      </p>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <Button
          onClick={() => reset()}
          className="flex items-center justify-center min-w-[200px]"
          variant="outline"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Try again
        </Button>
        <Button
          asChild
          className="flex items-center justify-center min-w-[200px]"
        >
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to homepage
          </Link>
        </Button>
      </div>
    </div>
  );
}
