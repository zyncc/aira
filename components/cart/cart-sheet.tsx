"use client";

import Image from "next/image";
import { Loader2, ShoppingBag, Trash2, X } from "lucide-react";
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
import { useCart } from "@/context/cart-context";
import { useRouter } from "next/navigation";
import { useCheckoutStore } from "@/context/checkoutStore";
import { Skeleton } from "../ui/skeleton";

export function CartSheet() {
  const router = useRouter();
  const {
    optimisticCart,
    removeFromCart,
    updateQuantity,
    loading,
    cartOpen,
    setCartOpen,
  } = useCart();

  const { setCheckoutItems } = useCheckoutStore();

  const itemCount = optimisticCart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const subtotal = optimisticCart.reduce((total, item) => {
    return total + item.product.price * item.quantity;
  }, 0);

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetTrigger className="relative" aria-label="Open Cart">
        <ShoppingBag size={25} className="cursor-pointer" />
        {itemCount > 0 && (
          <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
            {itemCount}
          </span>
        )}
      </SheetTrigger>
      <SheetContent className="flex w-full h-full p-0 flex-col sm:max-w-lg z-[100]">
        <div className="flex flex-col h-full">
          <SheetHeader className="border-b py-4 px-6">
            <div className="flex items-center justify-between">
              <SheetTitle>
                Your Bag (
                {optimisticCart.reduce(
                  (total, item) => total + item.quantity,
                  0
                )}
                )
              </SheetTitle>
            </div>
          </SheetHeader>
          <div className="px-6 overflow-y-auto h-full flex-1">
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
                <div className="flex items-center mt-10 h-full justify-center">
                  <p className="text-muted-foreground">Your Bag is Empty</p>
                </div>
              ) : (
                <ul className="divide-y w-full">
                  {optimisticCart.map((item, index) => (
                    <li key={index} className="py-4">
                      <div className="flex gap-4">
                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.title}
                            width={96}
                            height={96}
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                        <div className="flex flex-1 flex-col">
                          <div className="flex justify-between text-base font-medium line-clamp-1">
                            <h3>{item.product.title}</h3>
                            <p className="ml-4">
                              {formatCurrency(item.product.price)}
                            </p>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground-foreground">
                            Size:{" "}
                            {item.size === "sm"
                              ? "Small"
                              : item.size === "md"
                                ? "Medium"
                                : item.size === "lg"
                                  ? "Large"
                                  : item.size === "xl"
                                    ? "XL"
                                    : item.size === "doublexl"
                                      ? "2XL"
                                      : item.size}
                          </p>
                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center border rounded-md">
                              <button
                                type="button"
                                className="px-3 py-1 text-sm"
                                onClick={() =>
                                  updateQuantity(item.id!, item.quantity - 1)
                                }
                                disabled={item.quantity <= 1}
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
                                  updateQuantity(item.id!, item.quantity + 1)
                                }
                                disabled={item.quantity == 5}
                              >
                                +
                              </button>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFromCart(item.id!)}
                              className="h-8 w-8 text-destructive"
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
          <SheetFooter className="border-t py-4 px-6">
            <div className="w-full space-y-4">
              <div className="flex justify-between text-base font-medium">
                <p>Subtotal</p>
                <p>{formatCurrency(subtotal)}</p>
              </div>
              <Button
                className="w-full"
                size="lg"
                onClick={() => {
                  setCheckoutItems(optimisticCart);
                  router.push("/checkout");
                  setCartOpen(false);
                }}
                disabled={optimisticCart.length === 0}
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
