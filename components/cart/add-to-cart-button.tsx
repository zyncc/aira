"use client";

import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "../ui/use-toast";
import { z } from "zod";
import { useCart } from "@/context/cart-context";
import { Products } from "@/lib/types";
import { UUID } from "@/lib/generateUUID";
import { toast } from "sonner";

interface AddToCartButtonProps {
  product: Products;
  size: string;
  className?: string;
}

const sizeScheme = z.object({
  size: z.enum(["sm", "md", "lg", "xl"]),
});

export function AddToCartButton({
  product,
  size,
  className,
}: AddToCartButtonProps) {
  const { addToCart, optimisticCart, setCartOpen } = useCart();
  const handleAddToCart = async () => {
    if (size == "sm") {
      const validation = sizeScheme.safeParse({
        size: size,
      });
      if (!validation.success) {
        toast.error("Please select a size to continue");
        return;
      }
    } else if (size == "md") {
      const validation = sizeScheme.safeParse({
        size: size,
      });
      if (!validation.success) {
        toast.error("Please select a size to continue");
        return;
      }
    } else if (size == "lg") {
      const validation = sizeScheme.safeParse({
        size: size,
      });
      if (!validation.success) {
        toast.error("Please select a size to continue");
        return;
      }
    } else if (size == "xl") {
      const validation = sizeScheme.safeParse({
        size: size,
      });
      if (!validation.success) {
        toast.error("Please select a size to continue");
        return;
      }
    } else {
      const validation = sizeScheme.safeParse({
        size: size,
      });
      if (!validation.success) {
        toast.error("Please select a size to continue");
        return;
      }
    }
    const checkIfItemExists = optimisticCart.find(
      (item) => item.product.id == product.id
    );
    if (checkIfItemExists) {
      toast.error(`${product.title} already exists in your cart`);
      return;
    }
    addToCart({
      id: UUID(),
      product,
      size: size,
      quantity: 1,
    });
    setCartOpen(true);
  };

  return (
    <Button
      variant={"default"}
      onClick={handleAddToCart}
      className={className}
      size={"lg"}
    >
      <ShoppingBag className="mr-2 h-4 w-4" />
      Add to Cart
    </Button>
  );
}
