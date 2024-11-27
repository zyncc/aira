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
import {
  CartItemsWithProducts,
  cartItemWithProduct,
  CartWithCartItems,
} from "@/lib/types";
import { Session } from "next-auth";
import Link from "next/link";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useCheckoutStore } from "@/context/checkoutStore";

export default function CartSheet({
  CartItems,
  session,
}: {
  CartItems: CartWithCartItems | undefined | null;
  session: Session | null;
}) {
  function handleQuantityChange(
    event: React.ChangeEvent<HTMLSelectElement>,
    id: string
  ) {
    if (session?.user.id) {
      const item = CartItems?.items.find((item) => item.id === id);
      if (item) {
        cartDispatch({
          type: "UPDATE",
          payload: { ...item, quantity: Number(event.target.value) },
        });
        updateCartItemQuantity(
          CartItems?.userId ?? "",
          Number(event.target.value),
          id
        );
      }
    }
  }
  function cartReducer(
    state: cartItemWithProduct[],
    action: { type: string; payload: cartItemWithProduct }
  ) {
    switch (action.type) {
      case "DELETE":
        return state.filter((item) => item.id !== action.payload.id);
      case "UPDATE":
        return state.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        );
      default:
        return state;
    }
  }
  const router = useRouter();
  const { setCheckoutItems } = useCheckoutStore();
  const [optimisticItems, cartDispatch] = useOptimistic(
    CartItems?.items ?? [],
    cartReducer
  );
  const price = useMemo(() => {
    return optimisticItems.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
  }, [optimisticItems]);

  const count = CartItems?.items.length ?? 0;
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="relative">
          <span className="text-black text-sm absolute -top-4 -right-0">
            {count}
          </span>
          <RiShoppingBag3Line
            size={27}
            className="ml-3 font-medium text-[15px]"
          />
        </button>
      </SheetTrigger>
      <SheetContent className="max-md:min-w-[100%] min-w-[500px]">
        {optimisticItems.length === 0 && (
          <div className="h-full w-full flex items-center justify-center">
            <h1 className="font-medium text-xl">Your Bag is Empty :)</h1>
          </div>
        )}
        <ScrollArea className="h-full w-full">
          <SheetHeader>
            <SheetTitle>Bag</SheetTitle>
          </SheetHeader>
          <div className="mt-10 flex flex-col gap-y-5 pb-[101px]">
            {optimisticItems.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-5 w-full border-b-2 last:border-0 border-muted pb-5"
              >
                <>
                  <Link
                    href={`/${item.product.category}/${item.product.id}`}
                    className="flex"
                  >
                    <SheetClose>
                      <Image
                        src={item.product.images[0]}
                        height={200}
                        width={200}
                        alt="Image"
                        className="object-cover aspect-square rounded-lg flex-shrink-0"
                        priority
                      />
                    </SheetClose>
                  </Link>
                  <div className="w-full">
                    <div className="flex w-full justify-between max-[400px]:flex-col">
                      <h1 className="font-medium">{item.product.title}</h1>
                      <h1 className="font-semibold justify-self-end text-lg">
                        {formatCurrency(item.product.price).split(".")[0]}
                      </h1>
                    </div>
                    <h2 className="text-muted-foreground">
                      {capitalizeFirstLetter(item.product.color[0])}
                    </h2>
                    <h2 className="text-muted-foreground">
                      {(item.size == "sm" && "Small") ||
                        (item.size == "md" && "Medium") ||
                        (item.size == "lg" && "Large") ||
                        (item.size == "xl" && "XL")}
                    </h2>
                    <form>
                      <label htmlFor="quantity">Quantity</label>
                      <select
                        className="mx-2 p-1 focus:border-0 bg-transparent"
                        name="quantity"
                        id="quantity"
                        onChange={(e) => handleQuantityChange(e, item.id)}
                        value={item.quantity}
                      >
                        {[1, 2, 3, 4, 5].map((num) => (
                          <option
                            key={num}
                            value={num}
                            disabled={
                              (item.size === "sm" &&
                                (item.product.quantity?.sm ?? 0) < num) ||
                              (item.size === "md" &&
                                (item.product.quantity?.md ?? 0) < num) ||
                              (item.size === "lg" &&
                                (item.product.quantity?.lg ?? 0) < num) ||
                              (item.size === "xl" &&
                                (item.product.quantity?.xl ?? 0) < num)
                            }
                            className="disabled:text-muted"
                          >
                            {num}
                          </option>
                        ))}
                      </select>
                    </form>
                    <Button
                      variant={"link"}
                      size={"sm"}
                      onClick={() => {
                        cartDispatch({
                          type: "DELETE",
                          payload: {
                            product: item.product,
                            id: item.id,
                            cartId: item.cartId,
                            productId: item.productId,
                            size: item.size,
                            quantity: item.quantity,
                          },
                        });
                        deleteCartItem(item.id, session?.user.id as string);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="border-t border-muted bg-white py-4 px-6 text-left absolute bottom-0 left-0 right-0 w-full">
          <div className="flex justify-between">
            <h1 className="font-medium">Subtotal:</h1>
            <h1 className="font-medium">
              {formatCurrency(price).split(".")[0]}
            </h1>
          </div>
          {optimisticItems.length === 0 ? (
            <Button
              className="w-full mt-2"
              size={"lg"}
              disabled={optimisticItems.length === 0}
              onClick={() => {
                setCheckoutItems(undefined);
                setCheckoutItems(optimisticItems);
                router.push("/checkout");
              }}
            >
              Checkout
            </Button>
          ) : (
            <SheetClose className="w-full">
              <Button
                className="w-full mt-2"
                size={"lg"}
                disabled={optimisticItems.length === 0}
                onClick={() => {
                  setCheckoutItems(undefined);
                  setCheckoutItems(optimisticItems);
                  router.push("/checkout");
                }}
              >
                Checkout
              </Button>
            </SheetClose>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
