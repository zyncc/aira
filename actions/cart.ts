"use server";

import { getServerSession } from "@/lib/getServerSession";
import prisma from "@/lib/prisma";

export async function getCart() {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return [];
  }
  try {
    const cart = await prisma.cart.findUnique({
      where: {
        userId: session.user.id,
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                quantity: true,
              },
            },
          },
        },
      },
    });
    if (!cart) {
      return [];
    }
    return cart.items.map((item) => ({
      id: item.id,
      product: item.product,
      size: item.size,
      quantity: item.quantity,
    }));
  } catch (error) {
    console.error("Failed to get cart", error);
    return [];
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
    let cart = await prisma.cart.findUnique({
      where: {
        userId: session.user.id,
      },
    });
    if (!cart) {
      cart = await prisma.cart.create({
        data: {
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
      return;
    } else {
      await prisma.cartItems.create({
        data: {
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

  try {
    await prisma.cartItems.update({
      where: {
        id: itemId,
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
