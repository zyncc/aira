"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

export function SignInButton({ className }: { className?: string }) {
  const pathname = usePathname();
  return (
    <Link href={`/signin?callbackUrl=${pathname}`} className={className}>
      <Button type="submit" className="ml-3">
        Sign in
      </Button>
    </Link>
  );
}
