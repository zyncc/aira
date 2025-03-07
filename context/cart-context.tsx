"use client";

import {
  addToCartAction,
  getCart,
  removeFromCartAction,
  updateCartItemQuantity,
} from "@/actions/cart";
import { useSession } from "@/lib/authClient";
import { Products } from "@/lib/types";
import {
  createContext,
  Dispatch,
  SetStateAction,
  startTransition,
  useContext,
  useEffect,
  useOptimistic,
  useState,
} from "react";

export type CartItem = {
  id?: string;
  product: Products;
  size: string;
  quantity: number;
};

type CartContextType = {
  loading: boolean;
  optimisticCart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  cartOpen: boolean;
  setCartOpen: Dispatch<SetStateAction<boolean>>;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [optimisticCart, setOptimisticCart] = useOptimistic(cart);
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);

  const refetchCart = async () => {
    if (session?.user) {
      const updatedCart = await getCart();
      startTransition(() => {
        setOptimisticCart(updatedCart);
        setCart(updatedCart);
      });
    }
  };

  useEffect(() => {
    if (cartOpen && loading) {
      async function fetchCart() {
        if (session?.user) {
          const userCart = await getCart();
          startTransition(() => {
            setOptimisticCart(userCart);
            setCart(userCart);
          });
        } else {
          const storedCart = localStorage.getItem("cart");
          if (storedCart) setCart(JSON.parse(storedCart));
        }
        setLoading(false);
      }
      fetchCart();
    }
  }, [cartOpen, session, loading, setOptimisticCart]);

  useEffect(() => {
    if (!session?.user) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, session]);

  const addToCart = async (item: CartItem) => {
    startTransition(() => {
      setOptimisticCart((prev) => [...prev, item]);
      setCart((prev) => [...prev, item]);
    });

    if (session?.user) {
      await addToCartAction(item.product.id, item.size, item.quantity);
    } else {
      const getCart: CartItem[] = JSON.parse(localStorage.getItem("cart")!);
      const findItem = getCart.find(
        (cartItem: CartItem) => cartItem.product.id === item.product.id
      );
      if (findItem) {
        console.log("Item already exists in cart", findItem);
        return;
      } else {
        localStorage.setItem("cart", JSON.stringify([...cart, item]));
      }
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    startTransition(() => {
      setOptimisticCart((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
      setCart((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    });

    if (session?.user) {
      await updateCartItemQuantity(id, quantity);
      refetchCart();
    } else {
      localStorage.setItem(
        "cart",
        JSON.stringify(
          cart.map((item) => (item.id === id ? { ...item, quantity } : item))
        )
      );
    }
  };

  const removeFromCart = async (id: string) => {
    startTransition(() => {
      setOptimisticCart((prev) => prev.filter((item) => item.id !== id));
      setCart((prev) => prev.filter((item) => item.id !== id));
    });
    if (session?.user) {
      await removeFromCartAction(id);
      refetchCart();
    } else {
      localStorage.setItem(
        "cart",
        JSON.stringify(cart.filter((item) => item.id !== id))
      );
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
        cartOpen,
        setCartOpen,
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
