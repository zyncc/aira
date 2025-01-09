"use client";

import React, { useMemo, useOptimistic } from "react";
import Image from "next/image";
import formatCurrency from "@/lib/formatCurrency";
import { capitalizeFirstLetter } from "@/lib/caplitaliseFirstLetter";
import { deleteCartItem, updateCartItemQuantity } from "@/actions/action";
import { ScrollArea } from "../ui/scroll-area";
import { RiShoppingBag3Line } from "react-icons/ri";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cartItemWithProduct } from "@/lib/types";
import Link from "next/link";
import { Button } from "../ui/button";
import { usePathname, useRouter } from "next/navigation";
import { useCheckoutStore } from "@/context/checkoutStore";
import { useQuery } from "@tanstack/react-query";
import { fetchCart } from "@/actions/fetchCart";
import { Session } from "@/auth";
import { Minus, Plus, Trash2 } from "lucide-react";

export default function CartSheet({ session }: { session: Session | null }) {
  const {
    data: CartItems,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["fetchCartItems"],
    queryFn: async () => fetchCart(),
    enabled: false,
  });
  function handleQuantityChange(quantity: number, id: string) {
    const item = CartItems?.items.find((item) => item.id === id);
    if (item) {
      cartDispatch({
        type: "UPDATE",
        payload: { ...item, quantity },
      });
      updateCartItemQuantity(quantity, id);
      refetch();
    }
  }
  function cartReducer(
    state: cartItemWithProduct[] | undefined,
    action: { type: string; payload: cartItemWithProduct }
  ) {
    switch (action.type) {
      case "DELETE":
        return state?.filter((item) => item.id !== action.payload.id);
      case "UPDATE":
        return state?.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        );
      default:
        return state;
    }
  }
  const router = useRouter();
  const pathname = usePathname();
  const { setCheckoutItems } = useCheckoutStore();
  const [optimisticItems, cartDispatch] = useOptimistic(
    CartItems?.items,
    cartReducer
  );
  const price = useMemo(() => {
    return optimisticItems?.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
  }, [optimisticItems]);
  const totalItems = optimisticItems?.reduce(
    (acc, product) => acc + product.quantity,
    0
  );
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="relative" onClick={() => refetch()}>
          <RiShoppingBag3Line
            size={27}
            className="ml-3 font-medium text-[15px]"
          />
        </button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-md p-0">
        <SheetHeader className="p-6 border-b">
          <SheetTitle className="text-lg font-medium">
            Your Bag ({totalItems})
          </SheetTitle>
        </SheetHeader>
        <div className="flex h-full flex-1 flex-col">
          {/* Cart Items */}
          <ScrollArea className="flex-1">
            <div className="flex-1 px-6">
              {optimisticItems?.map((product) => (
                <div
                  key={product.id}
                  className="flex gap-4 py-6 border-b last:border-0"
                >
                  <div className="relative aspect-square h-24 w-24 overflow-hidden rounded-xl bg-muted">
                    <Link
                      href={`/${product.product.category}/${product.productId}`}
                    >
                      <SheetClose>
                        <Image
                          src={product.product.images[0]}
                          alt={product.product.title}
                          fill
                          className="object-cover transition-transform hover:scale-105"
                        />
                      </SheetClose>
                    </Link>
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="space-y-1">
                      <h3 className="font-medium tracking-tight">
                        {product.product.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Size:{" "}
                        {(product.size == "sm" && "Small") ||
                          (product.size == "md" && "Medium") ||
                          (product.size == "lg" && "Large") ||
                          (product.size == "xl" && "XL")}
                      </p>
                    </div>
                    <div className="flex items-end justify-between">
                      <div className="flex h-8 items-center rounded-lg border">
                        <button
                          className="flex h-full w-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                          disabled={product.quantity == 1}
                          onClick={() => {
                            handleQuantityChange(
                              product.quantity - 1,
                              product.id
                            );
                          }}
                        >
                          <Minus className="h-3 w-3" />
                          <span className="sr-only">Decrease quantity</span>
                        </button>
                        <div className="flex w-10 items-center justify-center text-sm">
                          {product.quantity}
                        </div>
                        <button
                          className="flex h-full w-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                          disabled={product.quantity == 5}
                          onClick={() => {
                            handleQuantityChange(
                              product.quantity + 1,
                              product.id
                            );
                          }}
                        >
                          <Plus className="h-3 w-3" />
                          <span className="sr-only">Increase quantity</span>
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-medium">
                          {formatCurrency(product.product.price).split(".")[0]}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-red-600"
                          onClick={() => {
                            cartDispatch({
                              type: "DELETE",
                              payload: {
                                product: product.product,
                                id: product.id,
                                cartId: product.cartId,
                                productId: product.productId,
                                size: product.size,
                                quantity: product.quantity,
                              },
                            });
                            deleteCartItem(product.id);
                            refetch();
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove item</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          {/* Cart Footer */}
          <div className="border-t p-4  mt-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between pt-2 font-medium">
                <span>Subtotal</span>
                <span>{formatCurrency(price!).split(".")[0]}</span>
              </div>
              <SheetClose className="w-full">
                <Button
                  className="w-full mt-2"
                  size={"lg"}
                  disabled={optimisticItems?.length === 0}
                  onClick={() => {
                    setCheckoutItems(undefined);
                    setCheckoutItems(optimisticItems);
                    router.push("/checkout");
                  }}
                >
                  Checkout
                </Button>
              </SheetClose>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
