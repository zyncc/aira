"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle, Bug, Home, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="bg-background flex min-h-screen w-full items-center justify-center p-4">
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="space-y-4 text-center">
          <div className="bg-destructive/10 mx-auto flex h-20 w-20 items-center justify-center rounded-full">
            <AlertTriangle className="text-destructive h-10 w-10" />
          </div>
          <div className="space-y-2">
            <h1 className="text-foreground text-3xl font-bold md:text-4xl">
              Something went wrong
            </h1>
            <p className="text-muted-foreground mx-auto max-w-md text-lg">
              We encountered an unexpected error. Don&apos;t worry, our team has been
              notified and we&apos;re working on a fix.
            </p>
          </div>
        </div>

        <Card className="mx-auto max-w-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bug className="h-5 w-5" />
              <span>Error Details</span>
            </CardTitle>
            <CardDescription>Technical information about what happened</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription className="font-mono text-sm break-all">
                {"An unexpected error occurred"}
              </AlertDescription>
            </Alert>

            {error.digest && (
              <div className="text-muted-foreground text-sm">
                <span className="font-medium">Error ID:</span>{" "}
                <code className="bg-muted rounded px-1 py-0.5 text-xs">
                  {error.digest}
                </code>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button onClick={reset} size="lg" className="min-w-[140px]">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="bg-background text-foreground min-w-[140px]"
          >
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
        </div>

        <div className="border-border space-y-4 border-t pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            If this problem persists, please{" "}
            <Link href="/contact" className="text-primary font-medium hover:underline">
              contact our support team
            </Link>{" "}
            with the error ID above.
          </p>
        </div>
      </div>
    </div>
  );
}
