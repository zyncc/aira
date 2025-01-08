"use client";

import React from "react";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import { signOut } from "@/lib/authClient";
import { useRouter } from "next/navigation";

export default function SignOutBtn() {
  const router = useRouter();
  return (
    <Button
      variant="ghost"
      className="text-destructive"
      onClick={async () =>
        await signOut({
          fetchOptions: {
            onSuccess: () => {
              router.refresh();
            },
          },
        })
      }
    >
      <LogOut className="mr-2 h-4 w-4" />
      Sign out
    </Button>
  );
}
