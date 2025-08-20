"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle, Home, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

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
    <div className="flex min-h-screen w-full items-center justify-center">
      <div className="w-full max-w-md rounded-lg px-6 py-8 shadow-2xl">
        <div className="flex flex-col items-center text-center">
          <AlertCircle className="mb-4 h-16 w-16 text-red-500" />
          <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
            Oops! Something went wrong
          </h1>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            We apologize for the inconvenience. Please try again or return to the
            homepage.
          </p>
          <div className="flex space-x-4">
            <Button onClick={reset} variant="outline" className="flex items-center">
              <RefreshCcw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Button asChild>
              <Link href="/" className="flex items-center">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
