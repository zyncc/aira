"use client";

import { Button } from "@/components/ui/button";
import formatCurrency from "@/lib/formatCurrency";
import { z } from "zod";
import { Products } from "@/lib/types";
import { useEffect, useState } from "react";
import sizechart from "@/public/apple-icon.png";
import { useRouter } from "next/navigation";
import { useCheckoutStore } from "@/context/checkoutStore";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { Share2Icon } from "lucide-react";

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
    if (size == "sm") {
      const validation = sizeScheme.safeParse({
        size: size,
        quantity: product.quantity?.sm,
      });
      if (!validation.success) {
        toast.error("Please select a size to continue");
        return null;
      }
    } else if (size == "md") {
      const validation = sizeScheme.safeParse({
        size: size,
        quantity: product.quantity?.md,
      });
      if (!validation.success) {
        toast.error("Please select a size to continue");
        return null;
      }
    } else if (size == "lg") {
      const validation = sizeScheme.safeParse({
        size: size,
        quantity: product.quantity?.lg,
      });
      if (!validation.success) {
        toast.error("Please select a size to continue");
        return null;
      }
    } else if (size == "xl") {
      const validation = sizeScheme.safeParse({
        size: size,
        quantity: product.quantity?.xl,
      });
      if (!validation.success) {
        toast.error("Please select a size to continue");
        return null;
      }
    } else if (size == "doublexl") {
      const validation = sizeScheme.safeParse({
        size: size,
        quantity: product.quantity?.doublexl,
      });
      if (!validation.success) {
        toast.error("Please select a size to continue");
        return null;
      }
    } else {
      const validation = sizeScheme.safeParse({
        size: size,
      });
      if (!validation.success) {
        toast.error("Please select a size to continue");
        return null;
      }
    }
    if (size) {
      setCheckoutItems(undefined);
      setCheckoutItems(cartItem);
      router.push("/checkout");
    }
  }

  function handleCopyButton() {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/${product.category}/${product.id}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  }

  return (
    <div className="md:basis-1/2 flex flex-col gap-3 container">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold line-clamp-1">{title}</h1>
        <Button size="icon" variant="outline" onClick={handleCopyButton}>
          <Share2Icon strokeWidth={2} />
        </Button>
      </div>
      <h1 className="text-xl font-medium">{formatted.split(".")[0]}</h1>
      <div className="flex flex-col md:items-center md:flex-row gap-6">
        <div className="flex-1">
          <div className="flex flex-col items-start gap-2">
            <div className="flex gap-6 items-start mb-2 overflow-hidden flex-wrap">
              <div className="flex items-start justify-start gap-2 flex-wrap">
                {quantity?.sm !== 0 && (
                  <span className="flex items-center text-red-500 flex-col gap-2">
                    <Button
                      size="lg"
                      variant={size === "sm" ? "default" : "outline"}
                      type="button"
                      onClick={() => setSize("sm")}
                      className={`flex items-center justify-center text-lg text-black border-2 ${
                        size === "sm" ? "border-primary" : ""
                      }`}
                    >
                      S
                    </Button>
                    {quantity && quantity?.sm < 5 && (
                      <span>{quantity?.sm} left</span>
                    )}
                  </span>
                )}
                {quantity?.md !== 0 && (
                  <span className="flex items-center text-red-500 flex-col gap-2">
                    <Button
                      size={"lg"}
                      variant={size == "md" ? "default" : "outline"}
                      type="button"
                      onClick={() => {
                        setSize("md");
                      }}
                      className={`flex flex-col text-lg border-2 text-black ${
                        size == "md" && "border-2 border-primary"
                      }`}
                    >
                      M
                    </Button>
                    {quantity && quantity?.md < 5 && (
                      <span>{quantity?.md} left</span>
                    )}
                  </span>
                )}
                {quantity?.lg !== 0 && (
                  <span className="flex items-center text-red-500 flex-col gap-2">
                    <Button
                      size={"lg"}
                      variant={size == "lg" ? "default" : "outline"}
                      type="button"
                      onClick={() => {
                        setSize("lg");
                      }}
                      className={`flex flex-col text-lg border-2 text-black ${
                        size == "lg" && "border-2 border-primary"
                      }`}
                    >
                      L
                    </Button>
                    {quantity && quantity?.lg < 5 && (
                      <span>{quantity?.lg} left</span>
                    )}
                  </span>
                )}
                {quantity?.xl !== 0 && (
                  <span className="flex items-center text-red-500 flex-col gap-2">
                    <Button
                      size={"lg"}
                      variant={size == "xl" ? "default" : "outline"}
                      type="button"
                      onClick={() => {
                        setSize("xl");
                      }}
                      className={`flex flex-col text-lg border-2 text-black ${
                        size == "xl" && "border-2 border-primary"
                      }`}
                    >
                      XL
                    </Button>
                    {quantity && quantity?.xl < 5 && (
                      <span>{quantity?.xl} left</span>
                    )}
                  </span>
                )}
                {quantity?.doublexl !== 0 && (
                  <span className="flex items-center text-red-500 flex-col gap-2">
                    <Button
                      size={"lg"}
                      variant={size == "doublexl" ? "default" : "outline"}
                      type="button"
                      onClick={() => {
                        setSize("doublexl");
                      }}
                      className={`flex flex-col text-lg border-2 text-black ${
                        size == "doublexl" && "border-2 border-primary"
                      }`}
                    >
                      2XL
                    </Button>
                    {quantity && quantity?.doublexl < 5 && (
                      <span>{quantity?.doublexl} left</span>
                    )}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-4 w-full">
              {quantity?.sm == 0 &&
              quantity?.md == 0 &&
              quantity?.lg == 0 &&
              quantity?.xl == 0 ? (
                <Button
                  disabled
                  aria-label="Button"
                  className="rounded-sm py-3 md:py-6"
                  variant={"outline"}
                  size={"lg"}
                >
                  Out of stock
                </Button>
              ) : (
                <AddToCartButton
                  className="rounded-sm
                   py-3 md:py-6 w-full"
                  product={product}
                  size={size!}
                />
              )}
              {quantity?.sm == 0 &&
              quantity?.md == 0 &&
              quantity?.lg == 0 &&
              quantity?.xl == 0 ? (
                <Button
                  disabled
                  aria-label="Button"
                  className="rounded-sm py-3 md:py-6"
                  variant={"outline"}
                  size={"lg"}
                >
                  Out of stock
                </Button>
              ) : (
                <Button
                  className={`rounded-sm py-3 md:py-6`}
                  variant={"secondary"}
                  size={"lg"}
                  type="button"
                  onClick={handleBuyButton}
                >
                  Buy now
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-3 mt-4 w-fit text-gray-600 ">
        <h3 className="font-medium text-primary">FREE DELIVERY</h3>
        <h3 className="font-medium text-primary border-l-2 pl-3">
          EASY RETURN / EXCHANGE
        </h3>
      </div>

      <Tabs
        defaultValue="description"
        className="border-2 border-primary p-3 rounded-md"
      >
        <TabsList className="bg-background max-md:w-full max-md:flex max-md:justify-evenly">
          <TabsTrigger
            value="description"
            className="data-[state=active]:shadow-none data-[state=active]:border-b-2 border-primary rounded-none transition-none"
          >
            Description
          </TabsTrigger>
          <TabsTrigger
            value="fabric"
            className="data-[state=active]:shadow-none data-[state=active]:border-b-2 border-primary rounded-none transition-none"
          >
            Fabric
          </TabsTrigger>
          <TabsTrigger
            value="care"
            className="data-[state=active]:shadow-none data-[state=active]:border-b-2 border-primary rounded-none transition-none"
          >
            Care
          </TabsTrigger>
          <TabsTrigger
            value="sizechart"
            className="data-[state=active]:shadow-none data-[state=active]:border-b-2 border-primary rounded-none transition-none"
          >
            Size Chart
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="description"
          className="font-medium bg-primary/30 p-3 rounded-md"
        >
          {product.description}
        </TabsContent>
        <TabsContent
          value="fabric"
          className="font-medium bg-primary/30 p-3 rounded-md"
        >
          {product.fabric}
        </TabsContent>
        <TabsContent
          value="care"
          className="font-medium bg-primary/30 p-3 rounded-md"
        >
          Change your password here.
        </TabsContent>
        <TabsContent value="sizechart" className="font-medium  p-3 rounded-md">
          <Image
            src={sizechart}
            placeholder="blur"
            className="object-cover"
            width={500}
            height={500}
            alt="size chart"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
