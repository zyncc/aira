"use client";

import { authClient } from "@/auth/auth-client";
import { addToWishlist, deleteWishlistItem } from "@/functions/user/wishlist";
import type { ProductsWithQuantity } from "@/lib/types";
import { uuid } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, {
  createContext,
  type Dispatch,
  type SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";

export type WishlistItem = {
  id?: string;
  product: ProductsWithQuantity;
};

export type LocalWishlistItem = {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  productPrice: number;
};

type WishlistContextType = {
  wishlistOpen: boolean;
  setWishlistOpen: Dispatch<SetStateAction<boolean>>;
  totalItems: number;
  wishlist: WishlistItem[];
  isLoading: boolean;
};

const WishlistContext = createContext<WishlistContextType | null>(null);

const WISHLIST_STORAGE_KEY = "wishlist";
const WISHLIST_QUERY_KEY = ["wishlist"];

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = authClient.useSession();
  const queryClient = useQueryClient();
  const [wishlistOpen, setWishlistOpen] = useState(false);

  const { data: wishlist = [], isLoading } = useQuery({
    queryKey: WISHLIST_QUERY_KEY,
    queryFn: fetchWishlist,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
    enabled: wishlistOpen,
  });

  const { totalItems } = useMemo(() => {
    const items = wishlist.reduce((sum) => sum, 0);
    return { totalItems: items };
  }, [wishlist]);

  async function fetchWishlist(): Promise<WishlistItem[]> {
    try {
      if (session) {
        const res = await fetch("/api/user/wishlist");
        if (!res.ok) throw new Error(`Failed to fetch wishlist: ${res.statusText}`);
        return (await res.json()) || [];
      } else {
        return getLocalwishlist();
      }
    } catch (err) {
      console.error("Error fetching wishlist:", err);
      return [];
    }
  }

  const getLocalwishlist = useCallback((): WishlistItem[] => {
    try {
      const data = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (!data) return [];
      const items: LocalWishlistItem[] = JSON.parse(data);
      return items.map((item) => ({
        id: item.id,
        product: {
          id: item.productId,
          title: item.productTitle,
          images: [item.productImage],
          price: item.productPrice,
        } as ProductsWithQuantity,
      }));
    } catch (err) {
      console.error("Error parsing local wishlist:", err);
      localStorage.removeItem(WISHLIST_STORAGE_KEY);
      return [];
    }
  }, []);

  const updateLocalwishlist = useCallback((items: WishlistItem[]) => {
    try {
      const localItems: LocalWishlistItem[] = items.map((item) => ({
        id: item.id || uuid(),
        productId: item.product.id,
        productTitle: item.product.title,
        productImage: item.product.images[0],
        productPrice: item.product.price,
      }));
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(localItems));
    } catch (err) {
      console.error("Error updating local wishlist:", err);
    }
  }, []);

  const addTowishlistMutation = useMutation({
    mutationFn: async (item: Omit<WishlistItem, "id">): Promise<void> => {
      if (session) {
        const res = await addToWishlist(item.product.id);
        if (!res.success) {
          toast.error(res.message);
        } else {
          setWishlistOpen(true);
        }
      } else {
        const checkLocalwishlist = getLocalwishlist();
        const itemAlreadyExists = checkLocalwishlist.some(
          (existingItem) => existingItem.product.id == item.product.id,
        );
        if (itemAlreadyExists) {
          toast.error("Item already exists in the wishlist");
          return;
        }
        const newItem = { ...item, id: uuid() };
        const updatedwishlist = [...getLocalwishlist(), newItem];
        updateLocalwishlist(updatedwishlist);
        setWishlistOpen(true);
      }
    },
    onMutate: async (newItem) => {
      await queryClient.cancelQueries({ queryKey: WISHLIST_QUERY_KEY });
      const prev = queryClient.getQueryData<WishlistItem[]>(WISHLIST_QUERY_KEY) || [];
      const existingIndex = prev.findIndex(
        (item) => item.product.id === newItem.product.id,
      );
      const updated =
        existingIndex >= 0
          ? prev.map((item, idx) => (idx === existingIndex ? { ...item } : item))
          : [...prev, { ...newItem, id: `temp-${Date.now()}` }];
      queryClient.setQueryData(WISHLIST_QUERY_KEY, updated);
      return { previouswishlist: prev };
    },
    onError: (err, _, context) => {
      if (context?.previouswishlist)
        queryClient.setQueryData(WISHLIST_QUERY_KEY, context.previouswishlist);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
    },
  });

  const removeFromwishlistMutation = useMutation({
    mutationFn: async (itemId: string) => {
      if (session) {
        const res = await deleteWishlistItem(itemId);
        if (!res.success) toast.error("Failed to remove item from wishlist");
      } else {
        const updatedwishlist = getLocalwishlist().filter((item) => item.id !== itemId);
        updateLocalwishlist(updatedwishlist);
      }
    },
    onMutate: async (itemId) => {
      await queryClient.cancelQueries({ queryKey: WISHLIST_QUERY_KEY });
      const prev = queryClient.getQueryData<WishlistItem[]>(WISHLIST_QUERY_KEY) || [];
      const updated = prev.filter((item) => item.id !== itemId);
      queryClient.setQueryData(WISHLIST_QUERY_KEY, updated);
      return { previouswishlist: prev };
    },
    onError: (err, _, context) => {
      if (context?.previouswishlist)
        queryClient.setQueryData(WISHLIST_QUERY_KEY, context.previouswishlist);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
    },
  });

  useEffect(() => {
    const syncwishlistToDatabase = async () => {
      if (!session) return;

      try {
        const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
        if (!stored) return;

        const items: LocalWishlistItem[] = JSON.parse(stored);
        if (items.length === 0) return;

        await Promise.all(items.map((item) => addToWishlist(item.productId)));

        localStorage.removeItem(WISHLIST_STORAGE_KEY);
        queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
      } catch (err) {
        console.error("Error syncing wishlist:", err);
        queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
      }
    };

    syncwishlistToDatabase();
  }, [session, queryClient]);

  const contextValue = useMemo(
    () => ({
      wishlistOpen,
      setWishlistOpen,
      totalItems,
      wishlist,
      isLoading,
      addTowishlist: addTowishlistMutation.mutateAsync,
      removeFromwishlist: removeFromwishlistMutation.mutateAsync,
    }),
    [
      wishlistOpen,
      setWishlistOpen,
      totalItems,
      wishlist,
      isLoading,
      addTowishlistMutation.mutateAsync,
      removeFromwishlistMutation.mutateAsync,
    ],
  );

  return (
    <WishlistContext.Provider value={contextValue}>{children}</WishlistContext.Provider>
  );
}

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within a Wishlist Provider");
  return context;
};
