"use client";

import { oneTap, useSession } from "@/lib/authClient";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function GoogleOneTap() {
  const { data: session } = useSession();
  const pathName = usePathname();
  useEffect(() => {
    (async function Google() {
      if (!session?.session) {
        await oneTap({
          context: "signin",
          autoSelect: true,
          cancelOnTapOutside: false,
          callbackURL: pathName,
        });
      }
    })();
  }, [session?.session, pathName]);
  return <></>;
}
