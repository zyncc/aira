"use client";

import { address } from "@prisma/client";
import { create } from "zustand";

type AddressType = {
  selectedAddress: address | undefined;
  setAddress: (address: address) => void;
};

export const useAddress = create<AddressType>((set) => ({
  selectedAddress: undefined,
  setAddress: (address) => set({ selectedAddress: address }),
}));
