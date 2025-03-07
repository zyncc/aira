"use client";

import { create } from "zustand";
import { CartItem } from "./cart-context";

type checkoutStore = {
  checkoutItems: CartItem[] | undefined;
  setCheckoutItems: (items: CartItem[] | undefined) => void;
};

export const useCheckoutStore = create<checkoutStore>((set) => ({
  checkoutItems: [],
  setCheckoutItems: (items) => set({ checkoutItems: items }),
}));
