"use server";

import { db } from "@/db/instance";
import { cart, cartItems } from "@/db/schema";
import { getServerSession } from "@/functions/auth/get-server-session";
import { uuid } from "@/lib/utils";
import { and, eq } from "drizzle-orm";

export async function addToCart(productId: string, quantity: number, size: string) {
  try {
    const session = await getServerSession();

    if (!session) {
      throw new Error("Not authenticated");
    }

    const findCart = await db.query.cart.findFirst({
      where: (cart) => eq(cart.userId, session.user.id),
    });

    if (!findCart) {
      const [createCart] = await db
        .insert(cart)
        .values({
          id: uuid(),
          userId: session.user.id,
        })
        .returning({ id: cart.id });

      await db.insert(cartItems).values({
        id: uuid(),
        productId,
        quantity,
        size,
        cartId: createCart.id,
      });
      return { success: true, message: "Added item to cart" };
    }

    const itemAlreadyInCart = await db.query.cartItems.findFirst({
      where: (cartItem) =>
        and(
          eq(cartItem.cartId, findCart.id),
          eq(cartItem.size, size),
          eq(cartItem.productId, productId),
        ),
    });

    if (itemAlreadyInCart) {
      return { success: false, message: "Item already in cart" };
    }

    await db.insert(cartItems).values({
      id: uuid(),
      cartId: findCart.id,
      productId,
      size,
      quantity,
    });
    return { success: true, message: "Added item to cart" };
  } catch (e) {
    console.error(e);
    return { success: false, message: "Failed to add item to cart" };
  }
}

export async function updateCartItemQuantity(id: string, quantity: number) {
  try {
    const session = await getServerSession();
    if (!session) {
      throw new Error("Not authenticated");
    }

    const findCartItem = await db.query.cartItems.findFirst({
      where: (cartItem) => eq(cartItem.id, id),
    });

    if (!findCartItem) {
      throw new Error("Cart item not found");
    }

    const findCart = await db.query.cart.findFirst({
      where: (cart) => eq(cart.id, findCartItem.cartId),
    });

    if (!findCart) {
      throw new Error("Cart not found");
    }

    if (findCart.userId !== session.user.id) {
      throw new Error("Unauthorized access to cart item");
    }

    await db
      .update(cartItems)
      .set({
        quantity,
      })
      .where(eq(cartItems.id, id));

    return { success: true, error: "Successfully updated cart item" };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to update cart item" };
  }
}

export async function deleteCartItem(id: string) {
  try {
    const session = await getServerSession();
    if (!session) {
      throw new Error("Not authenticated");
    }
    const findCartItem = await db.query.cartItems.findFirst({
      where: (cartItem) => eq(cartItem.id, id),
    });

    if (!findCartItem) {
      throw new Error("Cart item not found");
    }

    const findCart = await db.query.cart.findFirst({
      where: (cart) => eq(cart.id, findCartItem.cartId),
    });

    if (!findCart) {
      throw new Error("Cart not found");
    }

    if (findCart.userId !== session.user.id) {
      throw new Error("Unauthorized access to cart item");
    }

    await db.delete(cartItems).where(eq(cartItems.id, id));
    return { success: true, error: "Successfully deleted cart item" };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to delete cart item" };
  }
}
