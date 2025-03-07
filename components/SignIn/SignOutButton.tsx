"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { admin, signOut, useSession } from "@/lib/authClient";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export default function SignOutButton({ className }: { className?: string }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  if (session?.session.impersonatedBy) {
    return (
      <Button
        disabled={loading}
        onClick={async () => {
          setLoading(true);
          await admin.stopImpersonating({
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
        setLoading(true);
        await signOut({
          fetchOptions: {
            onSuccess: () => {
              router.refresh();
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
