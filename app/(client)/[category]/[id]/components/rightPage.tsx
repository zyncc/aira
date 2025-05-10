"use client";

import { Button } from "@/components/ui/button";
import formatCurrency from "@/lib/formatCurrency";
import { z } from "zod";
import type { Products } from "@/lib/types";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCheckoutStore } from "@/context/checkoutStore";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Heart, Share2Icon, Truck, RefreshCw } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import sizechart from "@/public/logo-512x512.png";

type Props = {
  product: Products;
};

const sizeScheme = z.object({
  size: z.enum(["sm", "md", "lg", "xl", "doublexl"]),
});

export default function RightPage({ product }: Props) {
  const [size, setSize] = useState<string | undefined>(undefined);
  const { title, description, price } = product;
  const formatted = formatCurrency(price);
  const [date, setDate] = useState<Date>();
  const { setCheckoutItems } = useCheckoutStore();
  const router = useRouter();
  const { quantity, ...newProduct } = product;
  const cartItemInfo = { size: size!, quantity: 1 };
  const cartItem = [
    {
      product,
      ...cartItemInfo,
    },
  ];

  useEffect(() => {
    var currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 3);
    setDate(currentDate);
  }, []);

  function handleBuyButton() {
    if (!size) {
      toast.error("Please select a size to continue");
      return null;
    }

    let sizeQuantity = 0;
    if (size === "sm") sizeQuantity = product.quantity?.sm || 0;
    else if (size === "md") sizeQuantity = product.quantity?.md || 0;
    else if (size === "lg") sizeQuantity = product.quantity?.lg || 0;
    else if (size === "xl") sizeQuantity = product.quantity?.xl || 0;
    else if (size === "doublexl")
      sizeQuantity = product.quantity?.doublexl || 0;

    if (sizeQuantity === 0) {
      toast.error("Selected size is out of stock");
      return null;
    }

    setCheckoutItems(undefined);
    setCheckoutItems(cartItem);
    router.push("/checkout");
  }

  function handleShareButton() {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/${product.category.replaceAll(" ", "-")}/${product.id}`;

    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: `Check out this product ${product.title} on`,
        url,
      });
      return;
    }

    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  }

  function handleAddToWishlist() {
    toast.success(`Added ${product.title} to Wishlist`);
  }

  const isOutOfStock =
    quantity?.sm === 0 &&
    quantity?.md === 0 &&
    quantity?.lg === 0 &&
    quantity?.xl === 0 &&
    quantity?.doublexl === 0;

  return (
    <div className="md:basis-1/2 flex flex-col gap-6 container">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl text-primary lg:text-3xl font-semibold tracking-tight text-gray-900">
            {title.toUpperCase()}
          </h1>
          <div className="flex gap-x-3">
            <Button
              size="icon"
              variant="ghost"
              className="rounded-full hover:bg-rose-50 hover:text-rose-500 transition-colors"
              onClick={handleAddToWishlist}
            >
              <Heart className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="rounded-full hover:bg-gray-100 transition-colors"
              onClick={handleShareButton}
            >
              <Share2Icon className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <h2 className="text-xl font-semibold text-primary">Rs. {formatted}</h2>
      </div>
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700">Select Size</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="link"
                  className="text-sm text-gray-500 hover:text-gray-900 underline p-0 h-auto"
                  size="sm"
                >
                  Size Guide
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-lg max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-center text-xl">
                    Size Chart
                  </DialogTitle>
                </DialogHeader>
                <div className="p-4">
                  <Image
                    src={sizechart}
                    className="object-cover rounded-md"
                    width={500}
                    height={500}
                    alt="Size chart showing measurements for different sizes"
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex flex-wrap gap-3">
            {[
              { key: "sm", label: "S", qty: quantity?.sm },
              { key: "md", label: "M", qty: quantity?.md },
              { key: "lg", label: "L", qty: quantity?.lg },
              { key: "xl", label: "XL", qty: quantity?.xl },
              { key: "doublexl", label: "2XL", qty: quantity?.doublexl },
            ].map((sizeOption) =>
              sizeOption.qty !== 0 ? (
                <div
                  key={sizeOption.key}
                  className="flex flex-col items-center gap-1"
                >
                  <Button
                    type="button"
                    onClick={() => setSize(sizeOption.key)}
                    className={`h-12 w-12 rounded-full font-medium transition-all ${size === sizeOption.key ? "text-white bg-primary" : "text-primary"} ${
                      size == sizeOption.key && "border-2 border-primary"
                    }`}
                    variant="outline"
                  >
                    {sizeOption.label}
                  </Button>
                  {sizeOption.qty && sizeOption.qty < 5 && (
                    <span className="text-xs text-red-800 font-medium">
                      {sizeOption.qty} left
                    </span>
                  )}
                </div>
              ) : null
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-2">
          {isOutOfStock ? (
            <Button
              disabled
              className="py-6 rounded-full bg-gray-100 text-gray-400"
              variant="outline"
            >
              Out of stock
            </Button>
          ) : (
            <>
              <AddToCartButton
                className="py-6 rounded-full bg-gray-900 hover:bg-gray-800 text-white font-medium text-base"
                product={product}
                size={size!}
              />
              <Button
                className="py-6 font-medium text-base"
                variant={"secondary"}
                onClick={handleBuyButton}
              >
                Buy now
              </Button>
            </>
          )}
        </div>
        <div className="flex md:flex-col justify-center gap-3 pt-2">
          <div className="flex items-center gap-3 text-primary">
            <Truck className="h-4 w-4 hidden md:block" />
            <span className="text-sm">Free delivery</span>
          </div>
          <div className="max-md:border-l max-md:border-primary/40 max-md:pl-3 flex items-center gap-3 text-primary">
            <RefreshCw className="h-4 w-4 hidden md:block" />
            <span className="text-sm">Easy returns & exchanges</span>
          </div>
        </div>
      </div>
      <Tabs defaultValue="description" className="pt-4">
        <TabsList className="w-full grid grid-cols-3 bg-secondary rounded-lg h-auto p-1">
          <TabsTrigger
            value="description"
            className="py-3 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm rounded-md"
          >
            Description
          </TabsTrigger>
          <TabsTrigger
            value="fabric"
            className="py-3 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm rounded-md"
          >
            Fabric
          </TabsTrigger>
          <TabsTrigger
            value="care"
            className="py-3 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm rounded-md"
          >
            Care
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="description"
          className="mt-4 p-4 bg-secondary rounded-lg"
        >
          <div className="prose prose-gray max-w-none font-medium">
            {product.description}
          </div>
        </TabsContent>
        <TabsContent
          value="fabric"
          className="mt-4 p-4 bg-secondary rounded-lg"
        >
          <div className="prose prose-gray max-w-none font-medium">
            100% Cotton Linen
          </div>
        </TabsContent>
        <TabsContent
          value="care"
          className="mt-4 p-4 bg-secondary rounded-lg font-medium"
        >
          <div className="prose prose-gray max-w-none">
            <ul className="list-disc pl-5 space-y-2">
              <li>Machine wash cold with similar colors</li>
              <li>Do not bleach</li>
              <li>Tumble dry low</li>
              <li>Cool iron if needed</li>
              <li>Do not dry clean</li>
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
