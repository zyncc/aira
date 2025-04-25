"use server";

import { getServerSession } from "@/lib/getServerSession";
import getPlaceholder from "@/lib/getPlaceholder";
import prisma from "@/lib/prisma";
import { AddressFormSchema, CreateProductFormSchema } from "@/lib/zodSchemas";
import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";

import { z } from "zod";
import { ulid } from "ulid";

export async function createProduct(
  data: z.infer<typeof CreateProductFormSchema>,
  formData: FormData
) {
  const session = await getServerSession();
  if (session?.user.role !== "admin") {
    return null;
  }

  const {
    breadth,
    category,
    color,
    description,
    fabric,
    fit,
    height,
    isArchived,
    isFeatured,
    largeQuantity,
    mediumQuantity,
    length,
    price,
    smallQuantity,
    title,
    transparency,
    weavePattern,
    weight,
    xlQuantity,
  } = data;

  const images = formData.getAll("images") as File[];

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  let arrayOfImages: string[] = [];
  if (images.length === 0) {
    throw new Error("No image provided");
  }
  if (images) {
    const uploadPromises = images.map(async (image) => {
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
        id: ulid(),
        title,
        description,
        price: Number(price),
        quantity: {
          create: {
            id: ulid(),
            sm: smallQuantity,
            md: mediumQuantity,
            lg: largeQuantity,
            xl: xlQuantity,
          },
        },
        fabric,
        transparency,
        weavePattern,
        fit,
        isFeatured: isFeatured,
        color: color,
        category: category,
        images: arrayOfImages as string[],
        isArchived: isArchived,
        length: length,
        breadth: breadth,
        height: height,
        weight: weight,
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
    revalidatePath("/");
    revalidatePath(`/${category}`);
    revalidatePath("/admin/products");
  }
}

export async function updateProduct(formData: FormData) {
  const session = await getServerSession();
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
  const session = await getServerSession();
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

type reviewProps = {
  images: File[] | null;
  pid: string;
  category: string;
  uid: string;
  title: string;
  description: string;
};

export async function uploadReview(formData: FormData) {
  const session = await getServerSession();
  if (!session?.session) {
    return null;
  }

  const data = Object.fromEntries(formData);

  const images = formData.getAll("images") as File[];

  const { category, description, pid, title, uid } = data;

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

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
          id: ulid(),
          title: title as string,
          description: description as string,
          images: arrayOfImages as string[],
          productId: pid as string,
          userId: uid as string,
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
          id: ulid(),
          title: title as string,
          description: description as string,
          productId: pid as string,
          userId: uid as string,
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
  const session = await getServerSession();
  if (!session?.user) {
    return null;
  }
  await prisma.address.create({
    data: {
      id: ulid(),
      userId: session.user.id,
      ...data,
    },
  });
  revalidatePath("/checkout");
  revalidatePath("/account/addresses");
  await prisma.activity.create({
    data: {
      id: ulid(),
      userId: session.user.id,
      title: "New address added",
      type: "address",
    },
  });
}

export async function updateUserAddress(
  data: z.infer<typeof AddressFormSchema>
) {
  const session = await getServerSession();
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
        id: ulid(),
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
