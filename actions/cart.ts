"use server";

import { LocalCartItem } from "@/context/cart-context";
import { getServerSession } from "@/lib/getServerSession";
import prisma from "@/lib/prisma";
import { nanoid } from "nanoid";

export async function getLocalCartProducts(items: LocalCartItem[]) {
  if (!items || items.length === 0) {
    return { products: [] };
  }

  const productIds = items.map((item) => item.productId);

  try {
    const products = await prisma.product.findMany({
      where: {
        isArchived: false,
        id: {
          in: [...productIds],
        },
      },
      include: {
        quantity: true,
      },
    });

    return { products };
  } catch (error) {
    console.error("Failed to get local cart products", error);
    return { products: [] };
  }
}

export async function addToCartAction(
  productId: string,
  size: string,
  quantity = 1
) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return { success: false, message: "Not authenticated" };
  }
  try {
    // Validate product exists
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
        isArchived: false,
      },
    });

    if (!product) {
      return { success: false, message: "Product not found" };
    }

    let cart = await prisma.cart.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          id: nanoid(12),
          userId: session.user.id,
        },
      });
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cartItems.findFirst({
      where: {
        cartId: cart.id,
        productId,
        size,
      },
    });

    if (existingItem) {
      // Update quantity if item exists
      await prisma.cartItems.update({
        where: {
          id: existingItem.id,
        },
        data: {
          quantity: existingItem.quantity + quantity,
        },
      });
    } else {
      // Create new item if it doesn't exist
      await prisma.cartItems.create({
        data: {
          id: nanoid(12),
          cartId: cart.id,
          productId,
          size,
          quantity,
        },
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to add to cart", error);
    return { success: false, message: "Failed to add to cart" };
  }
}

export async function removeFromCartAction(itemId: string) {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return { success: false, message: "Not authenticated" };
  }

  try {
    await prisma.cartItems.delete({
      where: {
        id: itemId,
        cart: {
          userId: session.user.id,
        },
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to remove from cart", error);
    return { success: false, message: "Failed to remove from cart" };
  }
}

export async function updateCartItemQuantity(itemId: string, quantity: number) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return { success: false, message: "Not authenticated" };
  }

  if (quantity < 1) {
    return { success: false, message: "Quantity must be at least 1" };
  }

  try {
    await prisma.cartItems.update({
      where: {
        id: itemId,
        cart: {
          userId: session.user.id,
        },
      },
      data: {
        quantity,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to update cart item quantity", error);
    return { success: false, message: "Failed to update cart item quantity" };
  }
}

export async function clearCart() {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return { success: false, message: "Not authenticated" };
  }

  try {
    const cart = await prisma.cart.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    if (cart) {
      await prisma.cartItems.deleteMany({
        where: {
          cartId: cart.id,
        },
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to clear cart", error);
    return { success: false, message: "Failed to clear cart" };
  }
}
