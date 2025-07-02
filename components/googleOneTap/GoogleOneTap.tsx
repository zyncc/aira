"use client";

import { oneTap } from "@/lib/authClient";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function GoogleOneTap() {
  const pathName = usePathname();

  useEffect(() => {
    (async () => {
      await oneTap({
        callbackURL: pathName,
      });
    })();
  }, [pathName]);

  return null;
}
