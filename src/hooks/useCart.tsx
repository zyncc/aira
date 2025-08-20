"use client";

import { authClient } from "@/auth/auth-client";
import { addToCart, deleteCartItem, updateCartItemQuantity } from "@/functions/user/cart";
import type { ProductsWithQuantity } from "@/lib/types";
import { uuid } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { toast } from "sonner";

export type CartItem = {
  id?: string;
  product: ProductsWithQuantity;
  size: string;
  quantity: number;
};

export type LocalCartItem = {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  productPrice: number;
  size: string;
  quantity: number;
};

type CartContextType = {
  cartOpen: boolean;
  setCartOpen: Dispatch<SetStateAction<boolean>>;
  totalItems: number;
  totalPrice: number;
  cart: CartItem[];
  isLoading: boolean;
  error: string | null;
  addToCart: (item: Omit<CartItem, "id">) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
};

const CartContext = createContext<CartContextType | null>(null);

const CART_STORAGE_KEY = "cart";
const CART_QUERY_KEY = ["cart"];

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = authClient.useSession();
  const queryClient = useQueryClient();
  const [cartOpen, setCartOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    data: cart = [],
    isLoading,
    error: queryError,
  } = useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: fetchCart,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
    enabled: cartOpen,
  });

  const { totalItems, totalPrice } = useMemo(() => {
    const items = cart.reduce((sum, item) => sum + item.quantity, 0);
    const price = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    return { totalItems: items, totalPrice: price };
  }, [cart]);

  async function fetchCart(): Promise<CartItem[]> {
    try {
      if (session) {
        const res = await fetch("/api/user/cart");
        if (!res.ok) throw new Error(`Failed to fetch cart: ${res.statusText}`);
        return (await res.json()) || [];
      } else {
        return getLocalCart();
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch cart");
      return [];
    }
  }

  const getLocalCart = useCallback((): CartItem[] => {
    try {
      const data = localStorage.getItem(CART_STORAGE_KEY);
      if (!data) return [];
      const items: LocalCartItem[] = JSON.parse(data);
      return items.map((item) => ({
        id: item.id,
        product: {
          id: item.productId,
          title: item.productTitle,
          images: [item.productImage],
          price: item.productPrice,
        } as ProductsWithQuantity,
        size: item.size,
        quantity: item.quantity,
      }));
    } catch (err) {
      console.error("Error parsing local cart:", err);
      localStorage.removeItem(CART_STORAGE_KEY);
      return [];
    }
  }, []);

  const updateLocalCart = useCallback((items: CartItem[]) => {
    try {
      const localItems: LocalCartItem[] = items.map((item) => ({
        id: item.id || uuid(),
        productId: item.product.id,
        productTitle: item.product.title,
        productImage: item.product.images[0],
        productPrice: item.product.price,
        size: item.size,
        quantity: item.quantity,
      }));
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(localItems));
    } catch (err) {
      console.error("Error updating local cart:", err);
      setError("Failed to save cart locally");
    }
  }, []);

  const addToCartMutation = useMutation({
    mutationFn: async (item: Omit<CartItem, "id">): Promise<void> => {
      if (session) {
        const res = await addToCart(item.product.id, item.quantity, item.size);
        if (!res.success) {
          toast.error(res.message);
        } else {
          setCartOpen(true);
        }
      } else {
        const checkLocalCart = getLocalCart();
        const itemAlreadyExists = checkLocalCart.some(
          (existingItem) =>
            existingItem.product.id == item.product.id && existingItem.size == item.size,
        );
        if (itemAlreadyExists) {
          toast.error("Item already exists in the cart");
          return;
        }
        const newItem = { ...item, id: uuid() };
        const updatedCart = [...getLocalCart(), newItem];
        updateLocalCart(updatedCart);
        setCartOpen(true);
      }
    },
    onMutate: async (newItem) => {
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEY });
      const prev = queryClient.getQueryData<CartItem[]>(CART_QUERY_KEY) || [];
      const existingIndex = prev.findIndex(
        (item) => item.product.id === newItem.product.id && item.size === newItem.size,
      );
      const updated =
        existingIndex >= 0
          ? prev.map((item, idx) =>
              idx === existingIndex
                ? { ...item, quantity: item.quantity + newItem.quantity }
                : item,
            )
          : [...prev, { ...newItem, id: `temp-${Date.now()}` }];
      queryClient.setQueryData(CART_QUERY_KEY, updated);
      return { previousCart: prev };
    },
    onError: (err, _, context) => {
      if (context?.previousCart)
        queryClient.setQueryData(CART_QUERY_KEY, context.previousCart);
      setError(err instanceof Error ? err.message : "Failed to add item");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      setError(null);
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (itemId: string) => {
      if (session) {
        const res = await deleteCartItem(itemId);
        if (!res.success) toast.error("Failed to remove item from cart");
      } else {
        const updatedCart = getLocalCart().filter((item) => item.id !== itemId);
        updateLocalCart(updatedCart);
      }
    },
    onMutate: async (itemId) => {
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEY });
      const prev = queryClient.getQueryData<CartItem[]>(CART_QUERY_KEY) || [];
      const updated = prev.filter((item) => item.id !== itemId);
      queryClient.setQueryData(CART_QUERY_KEY, updated);
      return { previousCart: prev };
    },
    onError: (err, _, context) => {
      if (context?.previousCart)
        queryClient.setQueryData(CART_QUERY_KEY, context.previousCart);
      setError(err instanceof Error ? err.message : "Failed to remove item");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      setError(null);
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      if (session) {
        const res = await updateCartItemQuantity(itemId, quantity);
        if (!res.success) toast.error("Failed to update cart item");
      } else {
        const updatedCart = getLocalCart().map((item) =>
          item.id === itemId ? { ...item, quantity } : item,
        );
        updateLocalCart(updatedCart);
      }
    },
    onMutate: async ({ itemId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEY });
      const prev = queryClient.getQueryData<CartItem[]>(CART_QUERY_KEY) || [];

      const optimistic = prev.map((item) =>
        item.id === itemId ? { ...item, quantity } : item,
      );
      queryClient.setQueryData(
        CART_QUERY_KEY,
        quantity <= 0 ? optimistic.filter((i) => i.id !== itemId) : optimistic,
      );
      return { previousCart: prev };
    },
    onError: (err, _, context) => {
      if (context?.previousCart)
        queryClient.setQueryData(CART_QUERY_KEY, context.previousCart);
      setError(err instanceof Error ? err.message : "Failed to update quantity");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      setError(null);
    },
  });

  useEffect(() => {
    const syncCartToDatabase = async () => {
      if (!session) return;

      try {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        if (!stored) return;

        const items: LocalCartItem[] = JSON.parse(stored);
        if (items.length === 0) return;

        await Promise.all(
          items.map((item) => addToCart(item.productId, item.quantity, item.size)),
        );

        localStorage.removeItem(CART_STORAGE_KEY);
        queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      } catch (err) {
        console.error("Error syncing cart:", err);
        setError("Failed to sync cart. Please try again.");
        queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      }
    };

    syncCartToDatabase();
  }, [session, queryClient]);

  const contextValue = useMemo(
    () => ({
      cartOpen,
      setCartOpen,
      totalItems,
      totalPrice,
      cart,
      isLoading,
      error: error || (queryError instanceof Error ? queryError.message : null),
      addToCart: addToCartMutation.mutateAsync,
      removeFromCart: removeFromCartMutation.mutateAsync,
      updateQuantity: (itemId: string, quantity: number) =>
        updateQuantityMutation.mutateAsync({ itemId, quantity }),
    }),
    [
      cartOpen,
      setCartOpen,
      totalItems,
      totalPrice,
      cart,
      isLoading,
      error,
      queryError,
      addToCartMutation.mutateAsync,
      removeFromCartMutation.mutateAsync,
      updateQuantityMutation.mutateAsync,
    ],
  );

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
