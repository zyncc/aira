//@ts-nocheck
"use client";

import { cartItemWithProduct } from "@/lib/types";
import { create } from "zustand";

type checkoutStore = {
  checkoutItems: cartItemWithProduct[] | undefined;
  setCheckoutItems: (
    items:
      | {
          product: {
            images: string[];
            color: string[];
            salePrice: number | null;
            isArchived: boolean;
            description: string;
            title: string;
            fit: string | null;
            createdAt: Date;
            price: number;
            fabric: string | null;
            transparency: string | null;
            id: string;
            weavePattern: string | null;
            category: string;
            isFeatured: boolean | null;
            updatedAt: Date;
          };
          quantity: number;
          size: string | null;
        }[]
      | undefined
  ) => void;
};

export const useCheckoutStore = create<checkoutStore>((set) => ({
  checkoutItems: [],
  setCheckoutItems: (items) => set({ checkoutItems: items }),
}));
