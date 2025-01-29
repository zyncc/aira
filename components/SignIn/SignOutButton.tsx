"use client";

import React from "react";
import { Button } from "../ui/button";
import { admin, signOut, useSession } from "@/lib/authClient";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
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
        className="hidden lg:block ml-3"
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
      className="ml-3"
    >
      Sign out
    </Button>
  );
}
