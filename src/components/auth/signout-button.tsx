"use client";

import { authClient } from "@/auth/auth-client";
import { Session } from "@/auth/server";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../ui/button";

export default function SignOutButton({
  session,
  className,
  refetch,
}: {
  session: Session | null;
  className?: string;
  refetch: () => void;
}) {
  const queryClient = useQueryClient();
  const router = useRouter();
  async function handleSignOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.refresh();
          refetch();
          queryClient.clear();
          document.cookie = "g_state=; max-age=0; path=/;";
        },
        onError: () => {
          toast.error("Failed to sign out");
        },
      },
    });
  }

  if (session?.session.impersonatedBy) {
    return (
      <Button onClick={() => authClient.admin.stopImpersonating()}>
        Stop Impersonating
      </Button>
    );
  }

  return (
    <Button className={cn("", className)} onClick={handleSignOut}>
      Sign out
    </Button>
  );
}
