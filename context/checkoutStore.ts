//@ts-nocheck
"use client";

import { cartItemWithProduct } from "@/lib/types";
import { Product } from "@prisma/client";
import { create } from "zustand";

type checkoutStore = {
  checkoutItems: cartItemWithProduct[] | undefined;
  setCheckoutItems: (
    items:
      | {
          product: Product | null;
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
