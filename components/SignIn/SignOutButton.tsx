"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { admin, signOut, useSession } from "@/lib/authClient";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export default function SignOutButton({ className }: { className?: string }) {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [loading, setLoading] = useState(false);

  if (!isPending && session?.session.impersonatedBy) {
    return (
      <Button
        disabled={loading}
        onClick={async () => {
          setLoading(true);
          await admin.stopImpersonating({
            fetchOptions: {
              onSuccess: () => {
                window.location.reload();
              },
            },
          });
          setLoading(false);
        }}
        type="submit"
        className={cn("ml-3", className)}
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="animate-spin" /> Stop Impersonating
          </div>
        ) : (
          "Stop Impersonating"
        )}
      </Button>
    );
  }

  return (
    <Button
      disabled={loading}
      onClick={async () => {
        document.cookie =
          "g_state=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        setLoading(true);
        await signOut({
          fetchOptions: {
            onSuccess: () => {
              router.refresh();
            },
          },
        });
        setLoading(false);
      }}
      type="submit"
      className={cn("ml-3", className)}
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="animate-spin" /> Sign out
        </div>
      ) : (
        "Sign out"
      )}
    </Button>
  );
}
