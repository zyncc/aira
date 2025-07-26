"use client";

import type React from "react";
import {
  addToCartAction,
  removeFromCartAction,
  updateCartItemQuantity,
} from "@/actions/cart";
import { useSession } from "@/lib/authClient";
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
import { ProductsWithQuantity } from "@/lib/types";

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
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartFetched, setCartFetched] = useState(false);
  const pendingUpdatesRef = useRef<Map<string, number>>(new Map());

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
            } as ProductsWithQuantity,
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
          setCartFetched(false);
          await fetchCart();
        }
      }
    };

    syncCartToDatabase();
  }, [session?.user, fetchCart]);

  useEffect(() => {
    if (cartOpen && !cartFetched) {
      fetchCart();
    }
  }, [cartOpen, cartFetched, fetchCart]);

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

  const addToCart = async (item: CartItem) => {
    const tempId =
      item.id ||
      `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const itemWithId = { ...item, id: tempId };

    startTransition(() => {
      setOptimisticCart((prev) => [...prev, itemWithId]);
      setCart((prev) => [...prev, itemWithId]);
    });

    try {
      if (session?.user) {
        addToCartAction(item.product.id, item.size, item.quantity).catch(
          console.error
        );
      } else {
        const storedCartJSON = localStorage.getItem("cart");
        const storedCart: LocalCartItem[] = storedCartJSON
          ? JSON.parse(storedCartJSON)
          : [];

        const existingItemIndex = storedCart.findIndex(
          (cartItem) =>
            cartItem.productId === item.product.id &&
            cartItem.size === item.size
        );

        if (existingItemIndex !== -1) {
          storedCart[existingItemIndex].quantity += item.quantity;
        } else {
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

      startTransition(() => {
        setOptimisticCart((prev) => prev.filter((i) => i.id !== tempId));
        setCart((prev) => prev.filter((i) => i.id !== tempId));
      });
    }
  };

  const debouncedUpdateQuantity = useDebounce(
    async (id: string, quantity: number) => {
      try {
        if (session?.user) {
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
        pendingUpdatesRef.current.delete(id);
      }
    },
    500
  );

  const updateQuantity = async (id: string, quantity: number) => {
    pendingUpdatesRef.current.set(id, quantity);

    startTransition(() => {
      setOptimisticCart((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
      setCart((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    });

    debouncedUpdateQuantity(id, quantity);
  };

  const removeFromCart = async (id: string) => {
    startTransition(() => {
      setOptimisticCart((prev) => prev.filter((item) => item.id !== id));
      setCart((prev) => prev.filter((item) => item.id !== id));
    });

    try {
      if (session?.user) {
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
