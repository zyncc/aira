"use client";

import { authClient } from "@/auth/auth-client";
import { useEffect } from "react";

export default function GoogleOneTap() {
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending || session) return;

    const timeout = setTimeout(async () => {
      await authClient.oneTap({
        fetchOptions: {
          onSuccess: () => {
            window.location.reload();
          },
        },
      });
    }, 3000);

    return () => clearTimeout(timeout);
  }, [isPending, session]);

  return null;
}
