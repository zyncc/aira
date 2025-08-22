"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCart } from "@/hooks/useCart";
import { useCheckout } from "@/hooks/useCheckout";
import { convertImage } from "@/lib/convert-image";
import { formatCurrency, formatSize } from "@/lib/utils";
import { ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Skeleton } from "./ui/skeleton";

export function CartSheet({ isTransparent }: { isTransparent?: boolean }) {
  const router = useRouter();
  const {
    removeFromCart,
    updateQuantity,
    cart,
    cartOpen,
    isLoading,
    setCartOpen,
    totalItems,
    totalPrice,
  } = useCart();
  const { setCheckoutItems } = useCheckout();

  const handleQuantityChange = async (id: string, newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > 5) return;
    updateQuantity(id, newQuantity);
  };

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetTrigger className="relative" aria-label="Open Cart">
        <ShoppingBag
          strokeWidth={2}
          size={24}
          className={`cursor-pointer ${isTransparent ? "text-white" : "text-primary"}`}
        />
        {totalItems > 0 && (
          <span className="bg-primary text-primary-foreground absolute -top-2 -right-2 flex h-3 w-3 items-center justify-center rounded-full p-2 text-xs">
            {totalItems}
          </span>
        )}
      </SheetTrigger>
      <SheetContent className="z-[100] flex h-full w-full flex-col p-0 sm:max-w-lg">
        <div className="flex h-full flex-col">
          <SheetHeader className="border-b px-4 py-4">
            <div className="flex items-center justify-between">
              <SheetTitle>Your Bag ({totalItems})</SheetTitle>
            </div>
          </SheetHeader>
          <div className="h-full flex-1 overflow-y-auto px-4">
            <div>
              {isLoading ? (
                <ul className="w-full divide-y">
                  {Array.from({ length: 3 }, (_, i) => i).map((_, index) => (
                    <li key={index} className="py-4">
                      <div className="flex gap-4">
                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                          <Skeleton className="h-full w-full" />
                        </div>
                        <div className="flex flex-1 flex-col">
                          <div className="flex justify-between text-base font-medium">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="ml-4 h-5 w-16" />
                          </div>
                          <Skeleton className="mt-1 h-4 w-20" />
                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center rounded-md border">
                              <Skeleton className="h-4 w-24" />
                            </div>
                            <Skeleton className="h-8 w-8 rounded-full" />
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : cart.length === 0 ? (
                <div className="mt-10 flex h-40 flex-col items-center justify-center text-center">
                  <ShoppingBag size={40} className="text-muted-foreground mb-4" />
                  <p className="text-muted-foreground font-medium">Your Bag is Empty</p>
                  <p className="text-muted-foreground mt-2 text-sm">
                    Add items to your bag to continue shopping
                  </p>
                </div>
              ) : (
                <ul className="w-full divide-y">
                  {cart.map((item, index) => (
                    <li key={index} className="py-4">
                      <div className="flex gap-4">
                        <div className="bg-muted h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                          {item.product.images && item.product.images.length > 0 ? (
                            <Image
                              src={convertImage(item.product.images[0], 200)}
                              alt={item.product.title}
                              width={70}
                              height={70}
                              placeholder="blur"
                              blurDataURL={item.product.placeholderImages[0]}
                              className="aspect-square h-full w-full object-cover object-top"
                            />
                          ) : (
                            <div className="bg-muted flex h-full w-full items-center justify-center">
                              <ShoppingBag className="text-muted-foreground h-8 w-8" />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-1 flex-col">
                          <div className="line-clamp-1 flex justify-between text-base font-medium">
                            <h3 className="line-clamp-1">{item.product.title}</h3>
                            <p className="ml-4 whitespace-nowrap">
                              Rs. {formatCurrency(item.product.price)}
                            </p>
                          </div>
                          <p className="text-muted-foreground mt-1 text-sm">
                            Size: {formatSize(item.size)}
                          </p>
                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center rounded-md border">
                              <button
                                type="button"
                                className="px-3 py-1 text-sm"
                                onClick={() =>
                                  handleQuantityChange(item.id!, item.quantity - 1)
                                }
                              >
                                −
                              </button>
                              <span className="px-3 py-1 text-sm">{item.quantity}</span>
                              <button
                                type="button"
                                className="px-3 py-1 text-sm"
                                onClick={() =>
                                  handleQuantityChange(item.id!, item.quantity + 1)
                                }
                              >
                                +
                              </button>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFromCart(item.id!)}
                              className="text-destructive h-8 w-8"
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
          <SheetFooter className="border-t px-4 py-4">
            <div className="w-full space-y-4">
              <div className="flex justify-between text-base font-medium">
                <p>Subtotal</p>
                <p>Rs. {formatCurrency(totalPrice)}</p>
              </div>
              <Button
                className="w-full"
                size="lg"
                onClick={() => {
                  setCheckoutItems(cart);
                  router.push("/checkout");
                  setCartOpen(false);
                }}
                disabled={cart.length === 0 || isLoading}
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
