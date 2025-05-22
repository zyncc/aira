"use client";

import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import type { Products } from "@/lib/types";
import { toast } from "sonner";
import { nanoid } from "nanoid";
import { useState } from "react";
import { useCart } from "@/context/cart-context";

interface AddToCartButtonProps {
  product: Products;
  size: string;
  className?: string;
}

const sizeScheme = z.object({
  size: z.enum(["sm", "md", "lg", "xl", "doublexl"]),
});

export function AddToCartButton({
  product,
  size,
  className,
}: AddToCartButtonProps) {
  const { addToCart, optimisticCart, setCartOpen } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    // Validate size
    const validation = sizeScheme.safeParse({ size });
    if (!validation.success) {
      toast.error("Please select a size to continue");
      return;
    }

    // Check if item already exists in cart
    const checkIfItemExists = optimisticCart.find(
      (item) => item.product.id === product.id && item.size === size
    );

    if (checkIfItemExists) {
      toast.error(`${product.title} already exists in your cart`);
      return;
    }

    setIsAdding(true);
    try {
      await addToCart({
        id: nanoid(12),
        product,
        size,
        quantity: 1,
      });

      // Open cart after a short delay to ensure the item is added
      setTimeout(() => {
        setCartOpen(true);
        setIsAdding(false);
      }, 100);
    } catch (error) {
      toast.error("Failed to add item to cart");
      console.error(error);
      setIsAdding(false);
    }
  };

  return (
    <Button
      className={`py-6 font-medium ${className}`}
      variant="default"
      size="default"
      type="button"
      onClick={handleAddToCart}
      disabled={isAdding}
    >
      {isAdding ? (
        <>
          <ShoppingBag className="mr-2 h-4 w-4 animate-pulse" />
          Adding...
        </>
      ) : (
        <>
          <ShoppingBag className="mr-2 h-4 w-4" />
          Add to Bag
        </>
      )}
    </Button>
  );
}
