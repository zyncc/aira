"use client";

import type React from "react";

import {
  addToCartAction,
  removeFromCartAction,
  updateCartItemQuantity,
} from "@/actions/cart";
import { useSession } from "@/lib/authClient";
import type { Products } from "@/lib/types";
import {
  createContext,
  type Dispatch,
  type SetStateAction,
  startTransition,
  useContext,
  useEffect,
  useOptimistic,
  useState,
  useRef,
  useCallback,
} from "react";

export type CartItem = {
  id?: string;
  product: Products;
  size: string;
  quantity: number;
};

// Enhanced LocalCartItem to store more product details
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
  loading: boolean;
  updating: boolean;
  optimisticCart: CartItem[];
  addToCart: (item: CartItem) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  cartOpen: boolean;
  setCartOpen: Dispatch<SetStateAction<boolean>>;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | null>(null);

// Debounce function to prevent rapid updates
function useDebounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        fn(...args);
        timeoutRef.current = null;
      }, delay);
    },
    [fn, delay]
  );
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [optimisticCart, setOptimisticCart] = useOptimistic(cart);
  const [loading, setLoading] = useState(false); // Only for initial loading
  const [updating, setUpdating] = useState(false); // For updates to cart
  const [cartOpen, setCartOpen] = useState(false);
  const [cartFetched, setCartFetched] = useState(false);
  const pendingUpdatesRef = useRef<Map<string, number>>(new Map());

  // Calculate totals
  const totalItems = optimisticCart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const totalPrice = optimisticCart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // Fetch cart data
  const fetchCart = useCallback(async () => {
    if (cartFetched && !updating) return; // Skip if already fetched and not updating

    try {
      if (session?.user) {
        setLoading(!cartFetched); // Only show loading on initial fetch
        setUpdating(cartFetched); // Show updating state for subsequent fetches

        const userCart: CartItem[] = await fetch("/api/fetchCart").then((res) =>
          res.json()
        );

        startTransition(() => {
          setOptimisticCart(userCart);
          setCart(userCart);
        });
      } else {
        // For localStorage, we don't need to fetch from server
        const storedCartJSON = localStorage.getItem("cart");
        if (storedCartJSON) {
          const storedCart: LocalCartItem[] = JSON.parse(storedCartJSON);

          // Convert LocalCartItem to CartItem with embedded product details
          const cartWithProducts = storedCart.map((item) => ({
            id: item.id,
            product: {
              id: item.productId,
              title: item.productTitle,
              images: [item.productImage],
              price: item.productPrice,
            } as Products,
            size: item.size,
            quantity: item.quantity,
          }));

          startTransition(() => {
            setCart(cartWithProducts);
            setOptimisticCart(cartWithProducts);
          });
        }
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
      setUpdating(false);
      setCartFetched(true);
    }
  }, [session, setOptimisticCart, cartFetched, updating]);

  // Sync localStorage cart to database when user logs in
  useEffect(() => {
    const syncCartToDatabase = async () => {
      if (session?.user) {
        const storedCartJSON = localStorage.getItem("cart");
        if (storedCartJSON) {
          const storedCart: LocalCartItem[] = JSON.parse(storedCartJSON);

          // Add each item to the database
          for (const item of storedCart) {
            await addToCartAction(item.productId, item.size, item.quantity);
          }

          // Clear localStorage after syncing
          localStorage.removeItem("cart");

          // Fetch the updated cart
          setCartFetched(false); // Reset so we fetch fresh data
          await fetchCart();
        }
      }
    };

    syncCartToDatabase();
  }, [session?.user, fetchCart]);

  // Fetch cart when opened for the first time
  useEffect(() => {
    if (cartOpen && !cartFetched) {
      fetchCart();
    }
  }, [cartOpen, cartFetched, fetchCart]);

  // Save cart to localStorage when it changes (for logged-out users)
  useEffect(() => {
    if (!session?.user && cart.length > 0) {
      const localCart: LocalCartItem[] = cart.map((item) => ({
        id:
          item.id ||
          `local-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        productId: item.product.id,
        productTitle: item.product.title || "",
        productImage: item.product.images?.[0] || "",
        productPrice: item.product.price || 0,
        size: item.size,
        quantity: item.quantity,
      }));

      localStorage.setItem("cart", JSON.stringify(localCart));
    }
  }, [cart, session]);

  // Add item to cart
  const addToCart = async (item: CartItem) => {
    // Generate a temporary ID if none exists
    const tempId =
      item.id ||
      `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const itemWithId = { ...item, id: tempId };

    // Optimistic update
    startTransition(() => {
      setOptimisticCart((prev) => [...prev, itemWithId]);
      setCart((prev) => [...prev, itemWithId]);
    });

    try {
      if (session?.user) {
        // Add to database in background, don't wait for response
        addToCartAction(item.product.id, item.size, item.quantity).catch(
          console.error
        );
      } else {
        const storedCartJSON = localStorage.getItem("cart");
        const storedCart: LocalCartItem[] = storedCartJSON
          ? JSON.parse(storedCartJSON)
          : [];

        // Check if item already exists
        const existingItemIndex = storedCart.findIndex(
          (cartItem) =>
            cartItem.productId === item.product.id &&
            cartItem.size === item.size
        );

        if (existingItemIndex !== -1) {
          // Update quantity if item exists
          storedCart[existingItemIndex].quantity += item.quantity;
        } else {
          // Add new item with full product details
          storedCart.push({
            id: tempId,
            productId: item.product.id,
            productTitle: item.product.title || "",
            productImage: item.product.images?.[0] || "",
            productPrice: item.product.price || 0,
            size: item.size,
            quantity: item.quantity,
          });
        }

        localStorage.setItem("cart", JSON.stringify(storedCart));
      }
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      // Revert optimistic update on error
      startTransition(() => {
        setOptimisticCart((prev) => prev.filter((i) => i.id !== tempId));
        setCart((prev) => prev.filter((i) => i.id !== tempId));
      });
    }
  };

  // Debounced version of the actual update function
  const debouncedUpdateQuantity = useDebounce(
    async (id: string, quantity: number) => {
      try {
        if (session?.user) {
          // Update in database without waiting for response
          updateCartItemQuantity(id, quantity).catch(console.error);
        } else {
          const storedCartJSON = localStorage.getItem("cart");
          if (storedCartJSON) {
            const storedCart: LocalCartItem[] = JSON.parse(storedCartJSON);
            const updatedCart = storedCart.map((item) =>
              item.id === id ? { ...item, quantity } : item
            );
            localStorage.setItem("cart", JSON.stringify(updatedCart));
          }
        }
      } catch (error) {
        console.error("Failed to update quantity:", error);
      } finally {
        // Remove this update from pending updates
        pendingUpdatesRef.current.delete(id);
      }
    },
    500
  ); // 500ms debounce

  // Update quantity with optimistic updates and debouncing
  const updateQuantity = async (id: string, quantity: number) => {
    // Store the latest quantity update for this item
    pendingUpdatesRef.current.set(id, quantity);

    // Optimistic update
    startTransition(() => {
      setOptimisticCart((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
      setCart((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    });

    // Debounced actual update
    debouncedUpdateQuantity(id, quantity);
  };

  // Remove item from cart
  const removeFromCart = async (id: string) => {
    // Optimistic update
    startTransition(() => {
      setOptimisticCart((prev) => prev.filter((item) => item.id !== id));
      setCart((prev) => prev.filter((item) => item.id !== id));
    });

    try {
      if (session?.user) {
        // Remove from database without waiting for response
        removeFromCartAction(id).catch(console.error);
      } else {
        const storedCartJSON = localStorage.getItem("cart");
        if (storedCartJSON) {
          const storedCart: LocalCartItem[] = JSON.parse(storedCartJSON);
          const updatedCart = storedCart.filter((item) => item.id !== id);
          localStorage.setItem("cart", JSON.stringify(updatedCart));
        }
      }
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        optimisticCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        loading,
        updating,
        cartOpen,
        setCartOpen,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
