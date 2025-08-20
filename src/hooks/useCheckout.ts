"use client";

import { create } from "zustand";
import { CartItem } from "./useCart";

type checkoutStore = {
  checkoutItems: CartItem[] | undefined;
  setCheckoutItems: (items: CartItem[] | undefined) => void;
};

export const useCheckout = create<checkoutStore>((set) => ({
  checkoutItems: [],
  setCheckoutItems: (items) => set({ checkoutItems: items }),
}));
