"use client";

import { oneTap, useSession } from "@/lib/authClient";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function GoogleOneTap() {
  const pathName = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    (async () => {
      if (session) return;
      await oneTap({
        callbackURL: pathName,
      });
    })();
  }, [pathName, session]);

  return null;
}
