"use server";

import { db } from "@/db/instance";
import { wishlist, wishlistItems } from "@/db/schema";
import { getServerSession } from "@/functions/auth/get-server-session";
import { uuid } from "@/lib/utils";
import { and, eq } from "drizzle-orm";

export async function addToWishlist(productId: string) {
  try {
    const session = await getServerSession();

    if (!session) {
      throw new Error("Not authenticated");
    }

    const findWishlist = await db.query.wishlist.findFirst({
      where: (wishlist) => eq(wishlist.userId, session.user.id),
    });

    if (!findWishlist) {
      const [createWishlist] = await db
        .insert(wishlist)
        .values({
          id: uuid(),
          userId: session.user.id,
        })
        .returning({ id: wishlist.id });

      await db.insert(wishlistItems).values({
        id: uuid(),
        productId,
        wishlistId: createWishlist.id,
      });
      return { success: true, message: "Added item to wishlist" };
    }

    const itemAlreadyInWishlist = await db.query.wishlistItems.findFirst({
      where: (wishlistItem) =>
        and(
          eq(wishlistItem.wishlistId, findWishlist.id),
          eq(wishlistItem.productId, productId),
        ),
    });

    if (itemAlreadyInWishlist) {
      return { success: false, message: "Item already in wishlist" };
    }

    await db.insert(wishlistItems).values({
      id: uuid(),
      wishlistId: findWishlist.id,
      productId,
    });
    return { success: true, message: "Added item to wishlist" };
  } catch (e) {
    console.error(e);
    return { success: false, message: "Failed to add item to wishlist" };
  }
}

export async function deleteWishlistItem(id: string) {
  try {
    const session = await getServerSession();
    if (!session) {
      throw new Error("Not authenticated");
    }
    const findWishlistItem = await db.query.wishlistItems.findFirst({
      where: (wishlistItem) => eq(wishlistItem.id, id),
    });

    if (!findWishlistItem) {
      throw new Error("Wishlist item not found");
    }

    const findWishlist = await db.query.wishlist.findFirst({
      where: (wishlist) => eq(wishlist.id, findWishlistItem.wishlistId),
    });

    if (!findWishlist) {
      throw new Error("Wishlist not found");
    }

    if (findWishlist.userId !== session.user.id) {
      throw new Error("Unauthorized access to wishlist item");
    }

    await db.delete(wishlistItems).where(eq(wishlistItems.id, id));
    return { success: true, error: "Successfully deleted wishlist item" };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to delete wishlist item" };
  }
}
