"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";
import { getServerSession } from "@/lib/getServerSession";
import ShortUniqueId from "short-unique-id";
const { randomUUID } = new ShortUniqueId({ length: 12 });

export async function deleteProduct(id: string) {
  const session = await getServerSession();
  if (session?.user.role !== "admin") {
    return null;
  }
  const getProduct = await prisma.product.findUnique({
    where: {
      id,
    },
  });
  const formattedLinks = getProduct?.images.map((link) => {
    const parts = link.split("/");
    const lastPartWithoutExtension = parts[parts.length - 1].split(".")[0];
    return `${parts[parts.length - 2]}/${lastPartWithoutExtension}`;
  });
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  formattedLinks !== undefined &&
    cloudinary.api.delete_resources(formattedLinks);
  try {
    await prisma.product.delete({
      where: {
        id,
      },
    });
    console.log("Product Deleted");
    revalidatePath("/admin/products");
    revalidatePath("/men");
  } catch (error) {
    return {
      error: "Something went wrong",
    };
  }
}

export async function archiveProduct(id: string) {
  const session = await getServerSession();
  if (session?.user.role !== "admin") {
    return null;
  }
  try {
    await prisma.product.update({
      where: {
        id,
      },
      data: {
        isArchived: true,
      },
    });
    console.log("Product Archived");
    revalidatePath("/admin/products");
    revalidatePath("/men");
  } catch (error) {
    return {
      error: "Something went wrong",
    };
  }
}

export async function unarchiveProduct(id: string) {
  const session = await getServerSession();
  if (session?.user.role !== "admin") {
    return null;
  }
  try {
    await prisma.product.update({
      where: {
        id,
      },
      data: {
        isArchived: false,
      },
    });
    console.log("Product UnArchived");
    revalidatePath("/admin/products");
    revalidatePath("/men");
  } catch (error) {
    return {
      error: "Something went wrong",
    };
  }
}

export async function addToCart(productId: string, size: string) {
  const session = await getServerSession();
  const userId = session?.user.id;
  const cartExists = await prisma.cart.findUnique({
    where: {
      userId,
    },
  });

  const itemExists = await prisma.cartItems.findFirst({
    where: {
      cart: {
        userId,
      },
      productId,
    },
  });

  if (itemExists) {
    return {
      exists: "Product already in cart",
    };
  }

  if (cartExists) {
    try {
      await prisma.cart.update({
        include: {
          items: true,
        },
        where: {
          userId,
        },
        data: {
          items: {
            create: {
              id: randomUUID(),
              productId,
              size,
            },
          },
        },
      });
    } catch (error) {
      return {
        error: "Something went wrong",
      };
    }
  } else {
    try {
      await prisma.cart.create({
        include: {
          items: true,
        },
        data: {
          id: randomUUID(),
          userId: userId!,
          items: {
            create: {
              id: randomUUID(),
              productId,
              size,
            },
          },
        },
      });
    } catch (error) {
      return {
        error: "Something went wrong",
      };
    }
  }
  revalidatePath("/cart");
}

export async function deleteCartItem(id: string) {
  const session = await getServerSession();
  try {
    await prisma.cartItems.delete({
      where: {
        cart: {
          userId: session?.user.id,
        },
        id,
      },
    });
  } catch (error) {
    return {
      error: "Something went wrong",
    };
  } finally {
    revalidatePath("/cart");
  }
}

export async function updateCartItemQuantity(quantity: number, id: string) {
  const session = await getServerSession();
  try {
    await prisma.cartItems.update({
      where: {
        cart: {
          userId: session?.user.id,
        },
        id,
      },
      data: {
        quantity,
      },
      include: {
        cart: true,
      },
    });
  } catch (error) {
    console.log(error);
  } finally {
    revalidatePath("/cart");
  }
}

export async function getSalesCount() {
  const session = await getServerSession();
  if (session?.user.role !== "admin") {
    return false;
  }
  const date = new Date();
  const year = date.getUTCFullYear();
  const startOfYear = new Date(year, 0, 1);
  const startOfNextYear = new Date(year + 1, 0, 1);
  return await prisma.order.findMany({
    where: {
      paymentSuccess: true,
      createdAt: {
        gte: startOfYear,
        lt: startOfNextYear,
      },
    },
    select: {
      createdAt: true,
    },
  });
}

export async function getTransactionsCount() {
  const session = await getServerSession();
  if (session?.user.role !== "admin") {
    return false;
  }
  const date = new Date();
  const year = date.getUTCFullYear();
  const startOfYear = new Date(year, 0, 1);
  const startOfNextYear = new Date(year + 1, 0, 1);
  return await prisma.order.findMany({
    where: {
      paymentSuccess: false,
      createdAt: {
        gte: startOfYear,
        lt: startOfNextYear,
      },
    },
    select: {
      createdAt: true,
    },
  });
}

export async function getNewUserCount() {
  const session = await getServerSession();
  if (session?.user.role !== "admin") {
    return false;
  }
  const date = new Date();
  const year = date.getUTCFullYear();
  const startOfYear = new Date(year, 0, 1);
  const startOfNextYear = new Date(year + 1, 0, 1);
  return await prisma.user.findMany({
    where: {
      createdAt: {
        gte: startOfYear,
        lt: startOfNextYear,
      },
    },
    select: {
      createdAt: true,
    },
  });
}
