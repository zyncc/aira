"use client";

import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useCart } from "@/context/cart-context";
import { Products } from "@/lib/types";
import { toast } from "sonner";
import { ulid } from "ulid";

interface AddToCartButtonProps {
  product: Products;
  size: string;
  className?: string;
}

const sizeScheme = z.object({
  size: z.enum(["sm", "md", "lg", "xl", "doublexl"]),
});

export function AddToCartButton({ product, size }: AddToCartButtonProps) {
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
      id: ulid(),
      product,
      size: size,
      quantity: 1,
    });
    setCartOpen(true);
  };

  return (
    <Button
      className={`py-6  font-medium`}
      variant={"default"}
      size={"default"}
      type="button"
      onClick={handleAddToCart}
    >
      <ShoppingBag className="mr-2 h-4 w-4" />
      Add to Bag
    </Button>
  );
}
