"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useCheckoutStore } from "@/context/checkoutStore";
import { Products } from "@/lib/types";
import { Session } from "@/auth";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import Link from "next/link";

const sizeScheme = z.object({
  size: z.enum(["sm", "md", "lg", "xl"]),
  quantity: z.number().gt(0),
});

export default function BuyButton({
  product,
  cartItemInfo,
  session,
}: {
  product: Products;
  cartItemInfo: { size: string | null; quantity: number };
  session: Session | null;
}) {
  const { setCheckoutItems } = useCheckoutStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [showModal, setShowModal] = useState(false);
  const { quantity, ...newProduct } = product;
  const cartItem = [
    {
      product: {
        ...newProduct,
      },
      ...cartItemInfo,
    },
  ];

  function handleBuyButton() {
    if (!session?.session) {
      setShowModal(true);
      return;
    }
    if (searchParams.get("size") == "sm") {
      const validation = sizeScheme.safeParse({
        size: searchParams.get("size"),
        quantity: product.quantity?.sm,
      });
      if (!validation.success) {
        toast({
          variant: "destructive",
          title: "Please select a size to continue",
        });
        return null;
      }
    } else if (searchParams.get("size") == "md") {
      const validation = sizeScheme.safeParse({
        size: searchParams.get("size"),
        quantity: product.quantity?.md,
      });
      if (!validation.success) {
        toast({
          variant: "destructive",
          title: "Please select a size to continue",
        });
        return null;
      }
    } else if (searchParams.get("size") == "lg") {
      const validation = sizeScheme.safeParse({
        size: searchParams.get("size"),
        quantity: product.quantity?.lg,
      });
      if (!validation.success) {
        toast({
          variant: "destructive",
          title: "Please select a size to continue",
        });
        return null;
      }
    } else if (searchParams.get("size") == "xl") {
      const validation = sizeScheme.safeParse({
        size: searchParams.get("size"),
        quantity: product.quantity?.xl,
      });
      if (!validation.success) {
        toast({
          variant: "destructive",
          title: "Please select a size to continue",
        });
        return null;
      }
    } else {
      const validation = sizeScheme.safeParse({
        size: searchParams.get("size"),
      });
      if (!validation.success) {
        toast({
          variant: "destructive",
          title: "Please select a size to continue",
        });
        return null;
      }
    }
    const size = searchParams.get("size");
    if (size) {
      setCheckoutItems(undefined);
      setCheckoutItems(cartItem);
      router.push("/checkout");
    }
  }

  return (
    <AlertDialog open={showModal} onOpenChange={setShowModal}>
      <Button
        className={`rounded-sm w-full py-3 md:py-6`}
        variant={"default"}
        size={"lg"}
        type="button"
        onClick={handleBuyButton}
      >
        Buy now
      </Button>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>You need to be Logged in</AlertDialogTitle>
          <AlertDialogDescription className="text-foreground">
            You must be logged in before you can Checkout
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setShowModal(false)}>
            Cancel
          </AlertDialogCancel>
          <Link href={`/signin?callbackUrl=${pathname}`}>
            <AlertDialogAction
              className="w-full"
              onClick={() => setShowModal(false)}
            >
              Sign in
            </AlertDialogAction>
          </Link>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
