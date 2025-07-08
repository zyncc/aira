"use client";

import { Button } from "@/components/ui/button";
import formatCurrency from "@/lib/formatCurrency";
import { z } from "zod";
import type { Products } from "@/lib/types";
import { useState } from "react";
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
import { Ban, ChartLine, RefreshCw, Share2Icon, Truck } from "lucide-react";
import sizechart from "@/public/sizechart.jpg";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { useWishlist } from "@/hooks/useWishlist";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { pincodeSchema } from "@/lib/zodSchemas";
import { Alert, AlertDescription } from "@/components/ui/alert";
import parse from "html-react-parser";
import { useQuery } from "@tanstack/react-query";

type Props = {
  product: Products;
};

type DeliveryState = { type: "success"; date: Date } | { type: "error" } | null;

export default function RightPage({ product }: Props) {
  const [size, setSize] = useState<string | undefined>(undefined);
  const [delivery, setDelivery] = useState<DeliveryState>(null);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const { title, price } = product;
  const { data } = useQuery({
    initialData: product,
    queryKey: ["product", product.id],
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
    queryFn: async () => {
      const response = await fetch(`/api/fetchProductDetails?id=${product.id}`);
      const data: Products = await response.json();
      return data;
    },
  });
  const formatted = formatCurrency(price);
  const { setCheckoutItems } = useCheckoutStore();
  const router = useRouter();
  const { quantity, ...newProduct } = data;
  const cartItemInfo = { size: size!, quantity: 1 };
  const cartItem = [
    {
      product: data,
      ...cartItemInfo,
    },
  ];

  const form = useForm<z.infer<typeof pincodeSchema>>({
    resolver: zodResolver(pincodeSchema),
    defaultValues: {
      pincode: "",
    },
  });

  async function onSubmit(values: z.infer<typeof pincodeSchema>) {
    setPincodeLoading(true);
    const getTTD = await fetch("/api/pincode?pincode=" + values.pincode);
    const data = await getTTD.json();

    if (!data.success) {
      setDelivery({ type: "error" });
      return;
    }

    const currentDate = new Date();
    const estimatedDeliveryDate = new Date();
    estimatedDeliveryDate.setDate(currentDate.getDate() + data.ttd);

    setDelivery({ type: "success", date: estimatedDeliveryDate });
    setPincodeLoading(false);
  }

  function handleBuyButton() {
    if (!size) {
      toast.error("Please select a size to continue");
      return null;
    }

    let sizeQuantity = 0;
    if (size === "sm") sizeQuantity = data.quantity?.sm || 0;
    else if (size === "md") sizeQuantity = data.quantity?.md || 0;
    else if (size === "lg") sizeQuantity = data.quantity?.lg || 0;
    else if (size === "xl") sizeQuantity = data.quantity?.xl || 0;
    else if (size === "doublexl") sizeQuantity = data.quantity?.doublexl || 0;

    if (sizeQuantity === 0) {
      toast.error("Selected size is out of stock");
      return null;
    }

    setCheckoutItems(undefined);
    setCheckoutItems(cartItem);
    router.push("/checkout");
  }

  function handleShareButton() {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/${data.category.replaceAll(" ", "-")}/${data.id}`;
    if (navigator.share) {
      navigator.share({
        title: data.title,
        text: `Check out this product ${data.title} on`,
        url,
      });
      return;
    }
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  }

  const { addToWishlist, removeFromWishlist, wishlist } = useWishlist();

  const isOutOfStock =
    (quantity?.sm === 0 &&
      quantity?.md === 0 &&
      quantity?.lg === 0 &&
      quantity?.xl === 0 &&
      quantity?.doublexl === 0) ||
    data.isArchived;

  return (
    <div className="md:basis-1/2 flex flex-col gap-6 container">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h1 className="text-lg text-primary mr-3 lg:text-2xl font-semibold line-clamp-1 tracking-tight">
            {title}
          </h1>
          <div className="flex gap-x-3">
            {wishlist.some((item) => item.product.id === data.id) ? (
              <GoHeartFill
                onClick={() => {
                  const wishlistItem = wishlist.find(
                    (item) => item.product.id === data.id
                  );
                  if (wishlistItem) {
                    removeFromWishlist(wishlistItem.id);
                    toast.error(`Removed ${data.title} from Wishlist`);
                  }
                }}
                color="#c62200"
                className="h-[20px] w-[20px] cursor-pointer"
              />
            ) : (
              <GoHeart
                onClick={() => {
                  addToWishlist(data.id);
                  toast.success(`Added ${data.title} to Wishlist`);
                }}
                color="#c62200"
                className="h-[20px] w-[20px] cursor-pointer"
              />
            )}
            <Share2Icon
              onClick={handleShareButton}
              className="h-[20px] w-[20px] text-3xl text-primary cursor-pointer"
            />
          </div>
        </div>
        <h2 className="text-lg lg:text-xl font-semibold text-primary">
          Rs. {formatted}
        </h2>
      </div>
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700">Select Size</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="link"
                  className="text-sm text-muted-foreground underline p-0 h-auto"
                  size="sm"
                >
                  Size Guide
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-lg">
                <DialogHeader>
                  <DialogTitle className="text-center text-xl text-primary">
                    Size Chart
                  </DialogTitle>
                </DialogHeader>
                <div className="">
                  <Image
                    src={sizechart}
                    className="object-cover"
                    width={1000}
                    height={1000}
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
                  {sizeOption.qty && sizeOption.qty <= 2 && (
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
              <AddToCartButton product={data} size={size!} />
              <Button
                className="py-6 font-medium"
                variant={"secondary"}
                onClick={handleBuyButton}
              >
                Buy now
              </Button>
            </>
          )}
        </div>
        <div className="flex md:flex-col justify-center gap-3 pt-2">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Truck className="h-4 w-4 hidden md:block" />
            <span className="text-sm">Free Shipping</span>
          </div>
          <div className="max-md:border-l max-md:border-primary/40 max-md:pl-3 flex items-center gap-3 text-muted-foreground">
            <RefreshCw className="h-4 w-4 hidden md:block" />
            <span className="text-sm">Easy returns & exchanges</span>
          </div>
          {data.order.length > 0 ? (
            <div className="max-md:border-l max-md:border-primary/40 max-md:pl-3 flex items-center gap-3 text-muted-foreground">
              <ChartLine className="h-4 w-4 hidden md:block" />
              <p className="text-sm">
                <span className={"font-semibold"}>{data.order.length}</span>{" "}
                {data.order.length == 1 ? "Person has" : "People have"} bought
                this so far
              </p>
            </div>
          ) : null}
        </div>
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex items-end gap-x-2"
            >
              <FormField
                control={form.control}
                name="pincode"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Check Expected Delivery Date</FormLabel>
                    <div className="flex items-center gap-x-2">
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Pincode"
                          className="w-fit"
                          {...field}
                        />
                      </FormControl>
                      <Button disabled={pincodeLoading} type="submit">
                        {pincodeLoading ? "Checking..." : "Check"}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        {delivery?.type === "success" && (
          <Alert className="bg-secondary" variant="default">
            <div className="flex items-center gap-x-2">
              <Truck size={18} />
              <AlertDescription>
                Expected to be delivered by{" "}
                {delivery.date.toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                })}
              </AlertDescription>
            </div>
          </Alert>
        )}
        {delivery?.type === "error" && (
          <Alert variant="destructive">
            <div className="flex items-center gap-x-2">
              <Ban size={18} />
              <AlertDescription>
                This pincode is not serviceable
              </AlertDescription>
            </div>
          </Alert>
        )}
      </div>
      <Tabs defaultValue="description">
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
          <div className="text-sm md:text-base">
            <p>{data.description}</p>
            <br />
            <h3 className="font-semibold">Product Details</h3>
            <ul className="list-disc list-inside">
              {parse(data.productDetails)}
            </ul>
            <br />
            <h3 className="font-semibold">Size & Fit</h3>
            <p>Model Height is 5'7" and wearing a size {data.modelSize}.</p>
            <br />
            <h3 className="font-semibold">Vibe Check</h3>
            <ul className="list-disc list-inside">{parse(data.vibeCheck)}</ul>
          </div>
        </TabsContent>
        <TabsContent
          value="fabric"
          className="mt-4 p-4 bg-secondary rounded-lg"
        >
          <div className="prose prose-gray max-w-none">100% Cotton Linen</div>
        </TabsContent>
        <TabsContent value="care" className="mt-4 p-4 bg-secondary rounded-lg">
          <div className="prose prose-gray max-w-none">
            <ul className="list-disc pl-5 space-y-2">
              <li>Cold water wash</li>
              <li>Use mild detergent</li>
              <li>
                Pure/Natural fabric is prone to wrinkling - high heat ironing
                gives the best finish.
              </li>
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
