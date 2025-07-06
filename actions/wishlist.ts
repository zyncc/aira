"use server";

import { getServerSession } from "@/lib/getServerSession";
import prisma from "@/lib/prisma";
import { nanoid } from "nanoid";

type LocalWishListItems = {
  id: string;
  productId: string;
}[];

export async function fetchLocalWishlist(items: LocalWishListItems) {
  if (!items || items.length === 0) {
    return { product: [] };
  }

  const ids = items.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: {
      isArchived: false,
      id: {
        in: [...ids],
      },
    },
    select: {
      id: true,
      images: true,
      title: true,
      price: true,
    },
  });
  return { product: products };
}

export async function addItemToWishlist(productId: string) {
  const session = await getServerSession();
  if (!session?.user) return null;

  // Check if product exists
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
      isArchived: false,
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  // Find or create wishlist
  let wishlist = await prisma.wishlist.findUnique({
    where: {
      userId: session.user.id,
    },
    include: {
      items: true,
    },
  });

  if (!wishlist) {
    wishlist = await prisma.wishlist.create({
      data: {
        id: nanoid(12),
        userId: session.user.id,
      },
      include: {
        items: true,
      },
    });
  }

  // Check if item already exists in wishlist
  const existingItem = wishlist.items.find(
    (item) => item.productId === productId
  );
  if (existingItem) {
    return existingItem;
  }

  // Add item to wishlist
  return await prisma.wishlistItems.create({
    data: {
      id: nanoid(12),
      productId,
      wishlistId: wishlist.id,
    },
  });
}

export async function removeItemFromWishlist(id: string) {
  const session = await getServerSession();
  if (!session) return null;
  try {
    return await prisma.wishlistItems.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    console.error("Error removing item from wishlist:", error);
    throw new Error("Failed to remove item from wishlist");
  }
}
