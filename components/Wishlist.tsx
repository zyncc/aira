"use client";

import { GoHeart } from "react-icons/go";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useWishlist } from "@/hooks/useWishlist";
import Image from "next/image";
import { ShoppingBag, Trash2Icon, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import formatCurrency from "@/lib/formatCurrency";
import { useState } from "react";
import { useCart } from "@/context/cart-context";
import { Products } from "@/lib/types";
import { quantity } from "@prisma/client";
import { useIsMobile } from "@/hooks/use-mobile";

type WishlistProps = {
  isTransparent: boolean;
};

export default function Wishlist({ isTransparent }: WishlistProps) {
  const { wishlist, removeFromWishlist, open, setOpen, isLoading } =
    useWishlist();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Products>();
  const [quantity, setQuantity] = useState<quantity | null>();
  const [size, setSize] = useState<string | undefined>();

  const isMobile = useIsMobile(639);

  async function fetchQuantity(productId: string) {
    const res = await fetch(`/api/getQuantity?productId=${productId}`);
    const data: Products = await res.json();
    setProduct(data);
    setQuantity(data.quantity);
  }

  function handleAddToCart(selectedSize: string, itemId: string) {
    console.log("CLICKED");
    setSize(selectedSize);
    addToCart({
      product: product!,
      size: selectedSize,
      quantity: 1,
    });
    removeFromWishlist(itemId);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <div className="relative">
          <GoHeart
            strokeWidth={0.2}
            size={24}
            className={`cursor-pointer ${isTransparent ? "text-white" : "text-primary"}`}
          />
          {wishlist.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {wishlist.length}
            </span>
          )}
        </div>
      </SheetTrigger>
      <SheetContent className="flex w-full px-4 h-full flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Wishlist</SheetTitle>
        </SheetHeader>
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <GoHeart size={40} className="text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Your wishlist is empty</p>
            <p className="text-sm text-muted-foreground mt-2">
              Add items to your wishlist to keep track of products you love
            </p>
          </div>
        ) : (
          <div className="space-y-6 mt-4 overflow-auto">
            {wishlist.map((item) => (
              <div
                key={item.product.id}
                className="border-b border-black/20 pb-4"
              >
                <div className="flex gap-3">
                  {item.product.images && item.product.images.length > 0 ? (
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.title}
                      width={100}
                      height={100}
                      className="object-cover aspect-square rounded-md object-top"
                    />
                  ) : (
                    <div className="w-[100px] h-[100px] bg-muted rounded-md flex items-center justify-center">
                      <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex flex-col ml-3 w-full">
                    <h3 className="font-medium">{item.product.title}</h3>
                    <h3>Rs. {formatCurrency(item.product.price)}</h3>
                    <div className="flex gap-3 mt-4 w-full">
                      {isMobile ? (
                        <Drawer>
                          <DrawerTrigger asChild>
                            <Button
                              onClick={() => fetchQuantity(item.product.id)}
                              className="flex w-full flex-1"
                              variant={"outline"}
                            >
                              <ShoppingBag className="mr-2 h-4 w-4" />
                              Move to Bag
                            </Button>
                          </DrawerTrigger>
                          <DrawerContent>
                            <DrawerHeader>
                              <DrawerTitle>Select a Size</DrawerTitle>
                              <DrawerDescription>
                                Please select a size to move the item to your
                                bag.
                              </DrawerDescription>
                            </DrawerHeader>
                            <div className="flex gap-x-3 my-6 items-start justify-center">
                              {[
                                { key: "sm", label: "S", qty: quantity?.sm },
                                { key: "md", label: "M", qty: quantity?.md },
                                { key: "lg", label: "L", qty: quantity?.lg },
                                { key: "xl", label: "XL", qty: quantity?.xl },
                                {
                                  key: "doublexl",
                                  label: "2XL",
                                  qty: quantity?.doublexl,
                                },
                              ].map((sizeOption) =>
                                sizeOption.qty !== 0 ? (
                                  <div
                                    key={sizeOption.key}
                                    className="flex flex-col items-center gap-1"
                                  >
                                    <Button
                                      disabled={
                                        sizeOption.qty !== undefined &&
                                        sizeOption.qty <= 0
                                      }
                                      type="button"
                                      onClick={() => {
                                        handleAddToCart(
                                          sizeOption.key,
                                          item.id
                                        );
                                      }}
                                      className={`h-12 w-12 rounded-full font-medium transition-all ${size === sizeOption.key ? "text-white bg-primary" : "text-primary"} ${
                                        size == sizeOption.key &&
                                        "border-2 border-primary"
                                      }`}
                                      variant="outline"
                                    >
                                      {sizeOption.label}
                                    </Button>
                                    {sizeOption.qty &&
                                      sizeOption.qty < 5 &&
                                      sizeOption.qty > 0 && (
                                        <span className="text-xs text-red-800 font-medium">
                                          {sizeOption.qty} left
                                        </span>
                                      )}
                                  </div>
                                ) : null
                              )}
                            </div>
                          </DrawerContent>
                        </Drawer>
                      ) : (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              onClick={() => fetchQuantity(item.product.id)}
                              className="flex w-full flex-1"
                              variant={"default"}
                            >
                              <ShoppingBag className="mr-2 h-4 w-4" />
                              Move to Bag
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Select a Size</DialogTitle>
                              <DialogDescription>
                                Please select a size to move the item to your
                                bag.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex gap-x-3 my-4 items-start justify-center">
                              {[
                                { key: "sm", label: "S", qty: quantity?.sm },
                                { key: "md", label: "M", qty: quantity?.md },
                                { key: "lg", label: "L", qty: quantity?.lg },
                                { key: "xl", label: "XL", qty: quantity?.xl },
                                {
                                  key: "doublexl",
                                  label: "2XL",
                                  qty: quantity?.doublexl,
                                },
                              ].map((sizeOption) =>
                                sizeOption.qty !== 0 ? (
                                  <div
                                    key={sizeOption.key}
                                    className="flex flex-col items-center gap-1"
                                  >
                                    <Button
                                      disabled={
                                        sizeOption.qty !== undefined &&
                                        sizeOption.qty <= 0
                                      }
                                      type="button"
                                      onClick={() => {
                                        setOpen(false);
                                        handleAddToCart(
                                          sizeOption.key,
                                          item.id
                                        );
                                      }}
                                      className={`h-12 w-12 rounded-full font-medium transition-all ${size === sizeOption.key ? "text-white bg-primary" : "text-primary"} ${
                                        size == sizeOption.key &&
                                        "border-2 border-primary"
                                      }`}
                                      variant="outline"
                                    >
                                      {sizeOption.label}
                                    </Button>
                                    {sizeOption.qty &&
                                      sizeOption.qty < 5 &&
                                      sizeOption.qty > 0 && (
                                        <span className="text-xs text-red-800 font-medium">
                                          {sizeOption.qty} left
                                        </span>
                                      )}
                                  </div>
                                ) : null
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                      <Button
                        onClick={async () => {
                          await removeFromWishlist(item.id);
                        }}
                        variant={"outline"}
                        size={"icon"}
                      >
                        <Trash2Icon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
