"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import formatCurrency from "@/lib/formatCurrency";
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
import Link from "next/link";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useCheckoutStore } from "@/context/checkoutStore";
import { useQuery } from "@tanstack/react-query";
import { Frown, Minus, Plus, Trash2 } from "lucide-react";
import { FetchCartItems } from "@/actions/fetchCartItems";

export default function SignedOutCartSheet() {
  const [cart, setCart] = useState<
    { id: string; size: string; quantity: number }[]
  >([]);

  const { data: CartItems, refetch } = useQuery({
    queryKey: ["fetchCartItems"],
    queryFn: async () => FetchCartItems(cart),
    enabled: false,
  });

  useEffect(() => {
    const localCart = localStorage.getItem("cart");
    if (localCart) {
      setCart(JSON.parse(localCart));
      if (JSON.parse(localCart!).length == 0) {
        localStorage.removeItem("cart");
        return;
      }
    }
  }, []);

  // Refetch cart items whenever the cart changes
  useEffect(() => {
    if (cart.length > 0) {
      refetch();
    }
  }, [cart, refetch]);

  const router = useRouter();
  const { setCheckoutItems } = useCheckoutStore();

  const price = useMemo(() => {
    return CartItems?.reduce(
      (acc, item) => acc + item.product?.price! * item.quantity,
      0
    );
  }, [CartItems]);

  const totalItems = CartItems?.reduce(
    (acc, product) => acc + product.quantity,
    0
  );

  function handleQuantityChange(quantity: number, id: string) {
    const cart: { id: string; size: string; quantity: number }[] = JSON.parse(
      localStorage.getItem("cart")!
    );

    const updatedCart = cart.map((item) => {
      if (item.id === id) {
        return { ...item, quantity };
      }
      return item;
    });

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
  }

  function deleteCartItem(id: string) {
    const cart: { id: string; size: string; quantity: number }[] = JSON.parse(
      localStorage.getItem("cart")!
    );
    const newCart = cart.filter((items) => items.id !== id);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  }
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
            Your Bag ({totalItems || 0})
          </SheetTitle>
        </SheetHeader>
        {CartItems?.length == 0 && (
          <div className="flex h-full w-full items-center justify-center flex-col gap-4">
            <Frown size={40} />
            <div className="text-center">
              <h1 className="text-lg">Your Bag is Empty</h1>
              <p className="text-sm">Start by adding items to your Bag</p>
            </div>
          </div>
        )}
        <div className="flex h-full flex-1 flex-col">
          {/* Cart Items */}
          <ScrollArea className="flex-1">
            <div className="flex-1 px-6">
              {CartItems?.map((product) => (
                <div
                  key={product.product?.id}
                  className="flex gap-4 py-6 border-b last:border-0"
                >
                  <div className="relative aspect-square h-24 w-24 overflow-hidden rounded-xl bg-muted">
                    <Link
                      href={`/${product.product?.category}/${product.product?.id}`}
                    >
                      <SheetClose>
                        <Image
                          src={product.product?.images[0]!}
                          alt={product.product?.title!}
                          fill
                          className="object-cover transition-transform hover:scale-105"
                        />
                      </SheetClose>
                    </Link>
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="space-y-1">
                      <h3 className="font-medium tracking-tight">
                        {product.product?.title}
                      </h3>
                      <p className="text-sm text-foreground">
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
                          className="flex h-full w-8 items-center justify-center text-foreground transition-colors hover:text-foreground"
                          disabled={product.quantity == 1}
                          onClick={() => {
                            handleQuantityChange(
                              product.quantity - 1,
                              product.product?.id!
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
                          className="flex h-full w-8 items-center justify-center text-foreground transition-colors hover:text-foreground"
                          disabled={product.quantity == 5}
                          onClick={() => {
                            handleQuantityChange(
                              product.quantity + 1,
                              product.product?.id!
                            );
                          }}
                        >
                          <Plus className="h-3 w-3" />
                          <span className="sr-only">Increase quantity</span>
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-medium">
                          {
                            formatCurrency(product?.product?.price!).split(
                              "."
                            )[0]
                          }
                        </span>
                        <button
                          onClick={() => deleteCartItem(product.product?.id!)}
                          className="h-8 w-8 text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove item</span>
                        </button>
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
                <span>{formatCurrency(price || 0).split(".")[0]}</span>
              </div>
              <SheetClose className="w-full">
                <Button
                  className="w-full mt-2"
                  size={"lg"}
                  disabled={CartItems?.length === 0}
                  onClick={() => {
                    setCheckoutItems(undefined);
                    setCheckoutItems(CartItems);
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
