"use client";

import type React from "react";
import {
  addItemToWishlist,
  fetchLocalWishlist,
  removeItemFromWishlist,
} from "@/actions/wishlist";
import { useSession } from "@/lib/authClient";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  type Dispatch,
  type SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

type WishlistProduct = {
  id: string;
  title: string;
  price: number;
  images: string[];
};

type WishlistItem = {
  id: string;
  product: WishlistProduct;
};

type LocalWishlistItem = {
  id: string;
  productId: string;
};

type WishlistData = {
  items: WishlistItem[];
};

type WishlistContextType = {
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (id: string) => Promise<void>;
  wishlist: WishlistItem[];
  isLoading: boolean;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["wishlistItems", session?.user?.id],
    queryFn: async () => {
      if (session?.user) {
        const res = await fetch("/api/fetchWishlist");
        const data: WishlistData = await res.json();
        return data?.items || [];
      } else {
        const localWishlistJSON = localStorage.getItem("wishlist");
        if (!localWishlistJSON) return [];

        const localWishlist: LocalWishlistItem[] =
          JSON.parse(localWishlistJSON);
        if (localWishlist.length === 0) return [];

        const data = await fetchLocalWishlist(localWishlist);

        return localWishlist.map((item) => ({
          id: item.id,
          product: data.product.find((p) => p.id === item.productId) || {
            id: item.productId,
            images: [],
            title: "",
            price: 0,
          },
        }));
      }
    },
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,
  });

  const wishlist = data || [];

  useEffect(() => {
    if (open) {
      if (session?.user) {
        refetch();
      }
    }
  }, [open, refetch]);

  const addToWishlist = async (productId: string): Promise<void> => {
    if (session?.user) {
      await addItemToWishlist(productId);
      refetch();
    } else {
      const localWishlistJSON = localStorage.getItem("wishlist");
      const localWishlist: LocalWishlistItem[] = localWishlistJSON
        ? JSON.parse(localWishlistJSON)
        : [];

      const newItem: LocalWishlistItem = {
        id: `local-${Date.now()}`,
        productId,
      };

      if (!localWishlist.some((item) => item.productId === productId)) {
        const updatedWishlist = [...localWishlist, newItem];
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
        queryClient.invalidateQueries({ queryKey: ["wishlistItems"] });
      }
    }
  };

  const removeFromWishlist = async (id: string): Promise<void> => {
    if (session?.user) {
      await removeItemFromWishlist(id);
      refetch();
    } else {
      const localWishlistJSON = localStorage.getItem("wishlist");
      if (localWishlistJSON) {
        const localWishlist: LocalWishlistItem[] =
          JSON.parse(localWishlistJSON);
        const updatedWishlist = localWishlist.filter((item) => item.id !== id);
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));

        queryClient.invalidateQueries({ queryKey: ["wishlistItems"] });
      }
    }
  };

  useEffect(() => {
    const syncWishlistToDatabase = async () => {
      if (session?.user) {
        const localWishlistJSON = localStorage.getItem("wishlist");
        if (localWishlistJSON) {
          const localWishlist: LocalWishlistItem[] =
            JSON.parse(localWishlistJSON);

          // Add each item to the database
          for (const item of localWishlist) {
            await addItemToWishlist(item.productId);
          }
          localStorage.removeItem("wishlist");
          refetch();
        }
      }
    };

    syncWishlistToDatabase();
  }, [session?.user, refetch]);

  return (
    <WishlistContext.Provider
      value={{
        addToWishlist,
        removeFromWishlist,
        wishlist,
        isLoading,
        open,
        setOpen,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context)
    throw new Error("useWishlist must be used within a WishlistProvider");
  return context;
};
