"use client";

import Image from "next/image";
import { Loader2, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import formatCurrency from "@/lib/formatCurrency";
import { useRouter } from "next/navigation";
import { useCheckoutStore } from "@/context/checkoutStore";
import { useState } from "react";
import { useCart } from "@/context/cart-context";
import { Skeleton } from "../ui/skeleton";

export function CartSheet({ isTransparent }: { isTransparent: boolean }) {
  const router = useRouter();
  const {
    optimisticCart,
    removeFromCart,
    updateQuantity,
    loading,
    cartOpen,
    setCartOpen,
    totalItems,
    totalPrice,
  } = useCart();
  const { setCheckoutItems } = useCheckoutStore();
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());

  const handleQuantityChange = async (id: string, newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > 5) return;

    setUpdatingItems((prev) => new Set(prev).add(id));
    try {
      await updateQuantity(id, newQuantity);
    } finally {
      // Remove from updating set after a short delay to prevent flickering
      setTimeout(() => {
        setUpdatingItems((prev) => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      }, 300);
    }
  };

  const formatSize = (size: string) => {
    switch (size) {
      case "sm":
        return "Small";
      case "md":
        return "Medium";
      case "lg":
        return "Large";
      case "xl":
        return "XL";
      case "doublexl":
        return "2XL";
      default:
        return size;
    }
  };

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetTrigger className="relative" aria-label="Open Cart">
        <ShoppingBag
          strokeWidth={3}
          size={19}
          className={`cursor-pointer ${isTransparent ? "text-white" : "text-primary"}`}
        />
        {totalItems > 0 && (
          <span className="absolute -right-2 -top-2 flex h-3 w-3 p-2 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
            {totalItems}
          </span>
        )}
      </SheetTrigger>
      <SheetContent className="flex w-full h-full p-0 flex-col sm:max-w-lg z-[100]">
        <div className="flex flex-col h-full">
          <SheetHeader className="border-b py-4 px-4">
            <div className="flex items-center justify-between">
              <SheetTitle>Your Bag ({totalItems})</SheetTitle>
            </div>
          </SheetHeader>
          <div className="px-4 overflow-y-auto h-full flex-1">
            <div>
              {loading ? (
                <ul className="divide-y w-full">
                  {Array.from({ length: 3 }, (_, i) => i).map((_, index) => (
                    <li key={index} className="py-4">
                      <div className="flex gap-4">
                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                          <Skeleton className="h-full w-full" />
                        </div>
                        <div className="flex flex-1 flex-col">
                          <div className="flex justify-between text-base font-medium">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-5 w-16 ml-4" />
                          </div>
                          <Skeleton className="mt-1 h-4 w-20" />
                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center border rounded-md">
                              <Skeleton className="h-4 w-24" />
                            </div>
                            <Skeleton className="h-8 w-8 rounded-full" />
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : optimisticCart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-center mt-10">
                  <ShoppingBag
                    size={40}
                    className="text-muted-foreground mb-4"
                  />
                  <p className="text-primary font-medium">Your Bag is Empty</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Add items to your bag to continue shopping
                  </p>
                </div>
              ) : (
                <ul className="divide-y w-full">
                  {optimisticCart.map((item, index) => (
                    <li key={index} className="py-4">
                      <div className="flex gap-4">
                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                          {item.product.images &&
                          item.product.images.length > 0 ? (
                            <Image
                              src={item.product.images[0]}
                              alt={item.product.title}
                              width={70}
                              height={70}
                              className="h-full w-full object-cover aspect-square object-top"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-muted">
                              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-1 flex-col">
                          <div className="flex justify-between text-base font-medium line-clamp-1">
                            <h3 className="line-clamp-1">
                              {item.product.title}
                            </h3>
                            <p className="ml-4 whitespace-nowrap">
                              Rs. {formatCurrency(item.product.price)}
                            </p>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">
                            Size: {formatSize(item.size)}
                          </p>
                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center border rounded-md">
                              <button
                                type="button"
                                className="px-3 py-1 text-sm"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.id!,
                                    item.quantity - 1
                                  )
                                }
                                disabled={
                                  updatingItems.has(item.id!) ||
                                  item.quantity <= 1
                                }
                              >
                                −
                              </button>
                              <span className="px-3 py-1 text-sm">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                className="px-3 py-1 text-sm"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.id!,
                                    item.quantity + 1
                                  )
                                }
                                disabled={
                                  updatingItems.has(item.id!) ||
                                  item.quantity >= 5
                                }
                              >
                                +
                              </button>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFromCart(item.id!)}
                              className="h-8 w-8 text-destructive"
                              disabled={updatingItems.has(item.id!)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Remove</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <SheetFooter className="border-t py-4 px-4">
            <div className="w-full space-y-4">
              <div className="flex justify-between text-base font-medium">
                <p>Subtotal</p>
                <p>Rs. {formatCurrency(totalPrice)}</p>
              </div>
              <Button
                className="w-full"
                size="lg"
                onClick={() => {
                  setCheckoutItems(optimisticCart);
                  router.push("/checkout");
                  setCartOpen(false);
                }}
                disabled={optimisticCart.length === 0 || loading}
              >
                Checkout
              </Button>
            </div>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}
