"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { useCheckout } from "@/hooks/useCheckout";
import { event } from "@/lib/fbpixel";
import { Product, Quantity } from "@/lib/types";
import { sendGTMEvent } from "@next/third-parties/google";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function DynamicQuantityClient({
  productWithoutQuantity,
  quantity,
}: {
  productWithoutQuantity: Product;
  quantity: Quantity;
}) {
  const [size, setSize] = useState<string | undefined>(undefined);
  const router = useRouter();
  const { setCheckoutItems } = useCheckout();
  const { addToCart } = useCart();
  const { data } = useQuery({
    initialData: quantity,
    queryKey: ["product", productWithoutQuantity.id],
    staleTime: 20 * 1000,
    refetchInterval: 20 * 1000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: false,
    queryFn: async () => {
      const response = await fetch(`/api/product/quantity?id=${product.id}`);
      const data: Quantity = await response.json();
      return data;
    },
  });

  const isOutOfStock =
    data.sm === 0 &&
    data.md === 0 &&
    data.lg === 0 &&
    data.xl === 0 &&
    data.doublexl === 0;

  const product = {
    ...productWithoutQuantity,
    quantity,
  };

  const cartItemInfo = { size: size!, quantity: 1 };
  const cartItem = [
    {
      product,
      ...cartItemInfo,
    },
  ];

  function handleBuyButton() {
    if (!size) {
      toast.error("Please select a size to continue");
      return null;
    }

    sendGTMEvent({
      event: "buy_now_clicked",
      value: productWithoutQuantity.title,
    });
    event("BuyNowClicked", {
      content_ids: [productWithoutQuantity.id],
      content_type: "product",
      value: productWithoutQuantity.price,
      currency: "INR",
      product_name: productWithoutQuantity.title,
      size: size,
    });

    let sizeQuantity = 0;
    if (size === "sm") sizeQuantity = data.sm || 0;
    else if (size === "md") sizeQuantity = data.md || 0;
    else if (size === "lg") sizeQuantity = data.lg || 0;
    else if (size === "xl") sizeQuantity = data.xl || 0;
    else if (size === "doublexl") sizeQuantity = data.doublexl || 0;

    if (sizeQuantity === 0) {
      toast.error("Selected size is out of stock");
      return null;
    }

    setCheckoutItems(undefined);
    setCheckoutItems(cartItem);
    router.push("/checkout");
  }
  return (
    <div className="flex flex-col">
      <div className="space-y-3">
        <div className="flex flex-wrap gap-3">
          {[
            { key: "sm", label: "S", qty: data.sm },
            { key: "md", label: "M", qty: data.md },
            { key: "lg", label: "L", qty: data.lg },
            { key: "xl", label: "XL", qty: data.xl },
            { key: "doublexl", label: "2XL", qty: data.doublexl },
          ].map((sizeOption) =>
            sizeOption.qty > 0 ? (
              <div key={sizeOption.key} className="flex flex-col items-center gap-1">
                <Button
                  type="button"
                  disabled={sizeOption.qty <= 0}
                  onClick={() => setSize(sizeOption.key)}
                  className={`h-12 w-12 rounded-full font-medium transition-all ${size === sizeOption.key ? "bg-primary text-white" : "text-primary"} ${
                    size == sizeOption.key && "border-primary border-2"
                  }`}
                  variant="outline"
                >
                  {sizeOption.label}
                </Button>
                {sizeOption.qty &&
                  sizeOption.qty <= 2 &&
                  sizeOption.qty > 0 &&
                  sizeOption.key !== "doublexl" && (
                    <span className="text-xs font-medium text-red-800">
                      {sizeOption.qty} left
                    </span>
                  )}
              </div>
            ) : (
              <div key={sizeOption.key} className="flex flex-col items-center gap-1">
                <Button
                  type="button"
                  disabled={sizeOption.qty <= 0}
                  className={`relative h-12 w-12 overflow-hidden rounded-full font-medium transition-all ${size === sizeOption.key ? "bg-primary text-white" : "text-primary"} ${
                    size == sizeOption.key && "border-primary border-2"
                  } ${sizeOption.qty <= 0 && "text-muted-foreground"}`}
                  variant="outline"
                >
                  {sizeOption.label}
                  {sizeOption.qty <= 0 && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="bg-muted-foreground absolute h-[1px] w-[140%] rotate-45" />
                    </span>
                  )}
                </Button>
              </div>
            ),
          )}
        </div>
      </div>
      <div className="mt-5 flex flex-col gap-3">
        {isOutOfStock ? (
          <Button
            disabled
            className="rounded-full bg-gray-100 py-6 text-gray-400"
            variant="outline"
          >
            Out of stock
          </Button>
        ) : (
          <>
            <Button
              className="py-6 font-medium"
              id="add_to_cart_button"
              onClick={() => {
                if (!size) {
                  toast.error("Please select a size to continue");
                  return;
                }
                sendGTMEvent({
                  event: "add_to_cart",
                  value: productWithoutQuantity.title,
                });
                event("AddToCart", {
                  content_ids: [productWithoutQuantity.id],
                  content_type: "product",
                  value: productWithoutQuantity.price,
                  currency: "INR",
                  product_name: productWithoutQuantity.title,
                  size: size,
                });

                addToCart({ product, size: size, quantity: 1 });
              }}
            >
              Add to Cart
            </Button>
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
    </div>
  );
}
