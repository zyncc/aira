"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Lock, LogIn, UserPlus } from "lucide-react";
import Link from "next/link";

export default function Unauthorized() {
  return (
    <div className="bg-background flex min-h-screen w-full items-center justify-center p-4">
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="space-y-4 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-500/10">
            <Lock className="text-destructive h-10 w-10" />
          </div>
          <div className="space-y-2">
            <h1 className="text-destructive text-6xl font-bold select-none md:text-7xl">
              401
            </h1>
            <h2 className="text-foreground text-3xl font-bold md:text-4xl">
              Authentication Required
            </h2>
            <p className="text-muted-foreground mx-auto max-w-md text-lg">
              You need to sign in to access this page. Please log in with your credentials
              to continue.
            </p>
          </div>
        </div>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Separator className="flex-1" />
            <span className="text-muted-foreground text-sm">or</span>
            <Separator className="flex-1" />
          </div>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="bg-background text-foreground min-w-[160px]"
            >
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" />
                Go to Login Page
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="bg-background text-foreground min-w-[160px]"
            >
              <Link href="/register">
                <UserPlus className="mr-2 h-4 w-4" />
                Create Account
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
