"use client";

import {Button} from "@/components/ui/button";
import {toast} from "@/components/ui/use-toast";
import {useCheckoutStore} from "@/context/checkoutStore";
import {Products} from "@/lib/types";
import {Session} from "next-auth";
import {useRouter, useSearchParams} from "next/navigation";
import React from "react";
import {z} from "zod";

const sizeScheme = z.object({
    size: z.enum(["sm", "md", "lg", "xl"]),
    quantity: z.number().gt(0),
});

export default function BuyButton({
                                      product,
                                      cartItemInfo,
                                      session,
                                  }: {
    product: Products;
    cartItemInfo: { size: string | null; quantity: number };
    session: Session | null;
}) {
    const {setCheckoutItems} = useCheckoutStore();
    const router = useRouter()
    const searchParams = useSearchParams();
    const {quantity, ...newProduct} = product;
    const cartItem = [
        {
            product: {
                ...newProduct,
            },
            ...cartItemInfo,
        },
    ];

    function handleBuyButton() {
        if (!session?.user) {
            toast({
                variant: "destructive",
                title: "Must be logged in",
            });
            return null;
        }
        if (searchParams.get("size") == "sm") {
            const validation = sizeScheme.safeParse({
                size: searchParams.get("size"),
                quantity: product.quantity?.sm,
            });
            if (!validation.success) {
                toast({
                    variant: "destructive",
                    title: "Please select a size to continue",
                });
                return null;
            }
        } else if (searchParams.get("size") == "md") {
            const validation = sizeScheme.safeParse({
                size: searchParams.get("size"),
                quantity: product.quantity?.md,
            });
            if (!validation.success) {
                toast({
                    variant: "destructive",
                    title: "Please select a size to continue",
                });
                return null;
            }
        } else if (searchParams.get("size") == "lg") {
            const validation = sizeScheme.safeParse({
                size: searchParams.get("size"),
                quantity: product.quantity?.lg,
            });
            if (!validation.success) {
                toast({
                    variant: "destructive",
                    title: "Please select a size to continue",
                });
                return null;
            }
        } else if (searchParams.get("size") == "xl") {
            const validation = sizeScheme.safeParse({
                size: searchParams.get("size"),
                quantity: product.quantity?.xl,
            });
            if (!validation.success) {
                toast({
                    variant: "destructive",
                    title: "Please select a size to continue",
                });
                return null;
            }
        } else {
            const validation = sizeScheme.safeParse({
                size: searchParams.get("size"),
            });
            if (!validation.success) {
                toast({
                    variant: "destructive",
                    title: "Please select a size to continue",
                });
                return null;
            }
        }
        const size = searchParams.get("size");
        if (size) {
            setCheckoutItems(undefined);
            setCheckoutItems(cartItem);
            router.push('/checkout')
        }
    }

    return (
        <Button
            aria-label="Button"
            className={`rounded-sm w-full py-3 md:py-6`}
            variant={"default"}
            size={"lg"}
            type="button"
            onClick={handleBuyButton}
        >
            Buy now
        </Button>
    );
}
