"use server";

import { auth } from "@/auth";
import getPlaceholder from "@/lib/getPlaceholder";
import prisma from "@/lib/prisma";
import { AddressFormSchema } from "@/lib/zodSchemas";
import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

export async function createProduct(formData: FormData) {
  const session = await auth.api.getSession({
    headers: headers(),
  });
  if (session?.user.role !== "admin") {
    return null;
  }
  const images = formData.getAll("images");
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const sm = formData.get("sm") as string;
  const md = formData.get("md") as string;
  const lg = formData.get("lg") as string;
  const xl = formData.get("xl") as string;
  const price = formData.get("price") as unknown as string;
  const color = formData.get("color") as string;
  const isArchived = formData.get("isArchived") as string;
  const isFeatured = formData.get("featured") as string;
  const category = formData.get("category") as string;
  const fabric = formData.get("fabric") as string;
  const transparency = formData.get("transparency") as string;
  const weavePattern = formData.get("weavePattern") as string;
  const fit = formData.get("fit") as string;
  const length = formData.get("length") as string;
  const breadth = formData.get("breadth") as string;
  const height = formData.get("height") as string;
  const weight = formData.get("weight") as string;

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  let arrayOfImages: string[] = [];
  if (images.length === 0) {
    return {
      noImage: true,
    };
  }
  if (images) {
    const uploadPromises = images.map(async (image, index) => {
      const file = image as File;
      const arrayBuffer = await file?.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);

      return new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "Products" }, (error, result) => {
            if (error) {
              reject(error);
              return;
            }
            resolve(result?.secure_url);
          })
          .end(buffer);
      });
    });
    const results = await Promise.allSettled(uploadPromises);
    results.forEach((result) => {
      if (result.status === "fulfilled") {
        arrayOfImages.push(result.value as string);
      } else {
        console.error("Failed to upload an image:", result.reason);
      }
    });
  }
  try {
    const newProduct = await prisma.product.create({
      data: {
        title,
        description,
        price: Number(price),
        quantity: {
          create: {
            sm: Number(sm),
            md: Number(md),
            lg: Number(lg),
            xl: Number(xl),
          },
        },
        fabric,
        transparency,
        weavePattern,
        fit,
        isFeatured: Boolean(isFeatured),
        color: color,
        category: category,
        images: arrayOfImages as string[],
        isArchived: Boolean(isArchived),
        length: Number(length),
        breadth: Number(breadth),
        height: Number(height),
        weight: Number(weight),
      },
      include: {
        quantity: true,
      },
    });
    let placeholderImages: string[] = [];
    const place = await getPlaceholder(newProduct.images);
    placeholderImages = place as string[];
    await prisma.product.update({
      where: { id: newProduct.id },
      data: { placeholderImages },
    });
  } catch (error) {
    console.log(error);
    throw Error("Failed to create product");
  } finally {
    // revalidatePath(`/${category}`);
    revalidatePath("/admin/products");
  }
}

export async function updateProduct(formData: FormData) {
  const session = await auth.api.getSession({
    headers: headers(),
  });
  if (session?.user.role !== "admin") {
    return;
  }
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const sm = formData.get("sm") as string;
  const md = formData.get("md") as string;
  const lg = formData.get("lg") as string;
  const xl = formData.get("xl") as string;
  const price = formData.get("price") as string;
  const color = formData.get("color") as string;
  const category = formData.get("category") as string;
  const isArchived = formData.get("isArchived") as string;
  const featured = formData.get("featured") as string;

  try {
    await prisma.product.update({
      where: {
        id,
      },
      data: {
        title,
        description,
        price: Number(price),
        quantity: {
          update: {
            sm: Number(sm),
            md: Number(md),
            lg: Number(lg),
            xl: Number(xl),
          },
        },
        color: color,
        category,
        isFeatured: Boolean(featured),
        isArchived: Boolean(Number(isArchived)),
      },
      include: {
        quantity: true,
      },
    });
  } catch (error) {
    console.log(error);
    throw Error("Failed to update product");
  } finally {
    revalidatePath(`/${category}`);
    revalidatePath("/admin/products");
  }
}

export async function updateProductWithImage(formData: FormData) {
  const session = await auth.api.getSession({
    headers: headers(),
  });
  if (session?.user.role !== "admin") {
    return;
  }
  const images = formData.getAll("images");
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const sm = formData.get("sm") as string;
  const md = formData.get("md") as string;
  const lg = formData.get("lg") as string;
  const xl = formData.get("xl") as string;
  const price = formData.get("price") as string;
  const color = formData.get("color") as string;
  const category = formData.get("category") as string;
  const isArchived = formData.get("isArchived") as string;
  const featured = formData.get("featured") as string;
  const colors = color.split(" ");

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  const prevProduct = await prisma.product.findUnique({
    where: {
      id,
    },
  });

  const prevImages = prevProduct?.images;

  let arrayOfImages = prevImages;

  for (const image of images) {
    const file = image as File;
    const arrayBuffer = await file?.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    const res: any = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({}, (error, result) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(result?.secure_url);
        })
        .end(buffer);
    });
    arrayOfImages?.push(res);
  }
  try {
    await prisma.product.update({
      where: {
        id,
      },
      data: {
        title,
        description,
        price: Number(price),
        quantity: {
          update: {
            sm: Number(sm),
            md: Number(md),
            lg: Number(lg),
            xl: Number(xl),
          },
        },
        color: color,
        category: category,
        isFeatured: Boolean(featured),
        images: arrayOfImages as string[],
        isArchived: Boolean(isArchived),
      },
    });
  } catch (error) {
    console.log(error);
    throw Error("Failed to update product");
  } finally {
    revalidatePath(`/${category}`);
    revalidatePath("/admin/products");
  }
}

export async function uploadReview(formData: FormData) {
  const session = await auth.api.getSession({
    headers: headers(),
  });
  if (!session?.session) {
    return null;
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  const images = formData
    .getAll("images")
    .filter(
      (file) =>
        file instanceof File && file.size > 0 && file.name !== "undefined"
    ) as File[];
  const pid = formData.get("pid") as string;
  const uid = formData.get("uid") as string;
  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const description = formData.get("description") as string;

  console.log("Images:", images);
  if (images) {
    let arrayOfImages = [];
    for (const image of images) {
      const file = image as File;
      const arrayBuffer = await file?.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);
      const res = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "Reviews" }, (error, result) => {
            if (error) {
              reject(error);
              return;
            }
            resolve(result?.secure_url);
          })
          .end(buffer);
      });
      arrayOfImages.push(res);
    }
    try {
      await prisma.reviews.create({
        data: {
          title,
          description,
          images: arrayOfImages as string[],
          productId: pid,
          userId: uid,
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      revalidatePath(`/${category}/${pid}`);
    }
  } else {
    try {
      await prisma.reviews.create({
        data: {
          title,
          description,
          productId: pid,
          userId: uid,
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      revalidatePath(`/${category}/${pid}`);
    }
  }
}

export async function createNewAddress(
  data: z.infer<typeof AddressFormSchema>
) {
  const session = await auth.api.getSession({
    headers: headers(),
  });
  if (!session?.user) {
    return null;
  }
  await prisma.address.create({
    data: {
      userId: session.user.id,
      ...data,
    },
  });
  revalidatePath("/checkout");
  revalidatePath("/account/addresses");
  await prisma.activity.create({
    data: {
      userId: session.user.id,
      title: "New address added",
      type: "address",
    },
  });
}

export async function updateUserAddress(
  data: z.infer<typeof AddressFormSchema>
) {
  const session = await auth.api.getSession({
    headers: headers(),
  });
  if (!session?.user) {
    return null;
  }
  const { id, ...rest } = data;
  try {
    await prisma.address.update({
      where: {
        id: data.id,
        userId: session.user.id,
      },
      data: {
        ...rest,
      },
    });
    revalidatePath("/checkout");
    revalidatePath("/account/addresses");
    await prisma.activity.create({
      data: {
        userId: session.user.id,
        title: "Updated address",
        type: "address",
      },
    });
  } catch (error) {
    console.log(error);
    throw new Error("Failed to edit Address");
  }
}

export async function deleteAddress(addressId: string) {
  const session = await auth.api.getSession({
    headers: headers(),
  });
  if (!session?.user) {
    return null;
  }
  await prisma.address.delete({
    where: {
      userId: session.user.id,
      id: addressId,
    },
  });
  revalidatePath("/account/addresses");
}
