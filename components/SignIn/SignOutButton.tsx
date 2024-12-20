"use client";

import React from "react";
import { Button } from "../ui/button";
import { signOut } from "@/lib/authClient";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const router = useRouter();
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
      className="hidden lg:block ml-3"
    >
      Sign out
    </Button>
  );
}
