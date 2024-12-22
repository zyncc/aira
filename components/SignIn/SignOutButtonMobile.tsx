"use client";

import React from "react";
import { Button } from "../ui/button";
import { admin, signOut, useSession } from "@/lib/authClient";
import { useRouter } from "next/navigation";

export default function SignOutButtonMobile() {
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
        className="lg:hidden"
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
      className="lg:hidden"
    >
      Sign out
    </Button>
  );
}
