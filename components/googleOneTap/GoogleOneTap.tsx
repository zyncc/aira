"use client";

import { oneTap, useSession } from "@/lib/authClient";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function GoogleOneTap() {
  const { data: session, isPending } = useSession();
  const pathName = usePathname();

  useEffect(() => {
    if (isPending || session?.user) return;
    (async () => {
      await oneTap({
        context: "signin",
        autoSelect: false,
        cancelOnTapOutside: false,
        callbackURL: pathName,
      });
    })();
  }, [isPending, session, pathName]);

  return null;
}
