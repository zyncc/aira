"use client";

import React from "react";
import { Button } from "../ui/button";
import { admin, signOut, useSession } from "@/lib/authClient";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function SignOutButton({ className }: { className?: string }) {
  const router = useRouter();
  const session = useSession();

  if (session.data?.session.impersonatedBy) {
    return (
      <Button
        onClick={async () =>
          await admin.stopImpersonating({
            fetchOptions: {
              onSuccess: () => {
                router.refresh();
              },
            },
          })
        }
        type="submit"
        className={cn("ml-3", className)}
      >
        Stop Impersonating
      </Button>
    );
  }

  return (
    <Button
      onClick={async () =>
        await signOut({
          fetchOptions: {
            onSuccess: () => {
              router.refresh();
            },
          },
        })
      }
      type="submit"
      className={cn("ml-3", className)}
    >
      Sign out
    </Button>
  );
}
