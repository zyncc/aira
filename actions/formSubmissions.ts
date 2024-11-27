"use server";

import getPlaceholder from "@/lib/getPlaceholder";
import getSession from "@/lib/getSession";
import prisma from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import sharp from "sharp";

export async function createProduct(formData: FormData) {
  const session = await getSession();
  if (session?.user.role !== "Admin") {
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
  const colors = color.split(" ");

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
      let openGraphImage;
      if (index == 0) {
        const fileBuffer = Buffer.from(await file.arrayBuffer());
        openGraphImage = await sharp(fileBuffer)
          .resize({
            fit: "cover",
            width: 1200,
            height: 630,
          })
          .jpeg({ quality: 90 })
          .toBuffer();
        console.log(openGraphImage);
      }
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
        color: colors,
        category: category,
        images: arrayOfImages as string[],
        isArchived: Boolean(isArchived),
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
    revalidatePath("/men");
    revalidatePath("/admin/products");
  }
}

export async function updateProduct(formData: FormData) {
  const session = await getSession();
  if (session?.user.role !== "Admin") {
    return null;
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
  const colors = color.split(" ");

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
        color: colors,
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
  const session = await getSession();
  if (session?.user.role !== "Admin") {
    return null;
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
        color: colors,
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
  const session = await getSession();
  if (!session?.user) {
    return null;
  }
  const images = formData.getAll("images");
  const pid = formData.get("pid") as string;
  const uid = formData.get("uid") as string;
  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const description = formData.get("description") as string;

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

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
      redirect(`/${category}/${pid}`);
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
      revalidatePath(`/men/${pid}`);
    }
  }
}

export async function createNewAddress(formData: FormData) {
  const session = await getSession();
  if (!session?.user) {
    return null;
  }
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const address1 = formData.get("address1") as string;
  const address2 = formData.get("address2") as string;
  const state = formData.get("state") as string;
  const zipcode = formData.get("zipcode") as string;
  const landmark = formData.get("landmark") as string;
  await prisma.address.create({
    data: {
      userId: id,
      name,
      email,
      phone,
      address1,
      address2,
      landmark,
      state,
      zipcode: Number(zipcode),
    },
  });
  revalidatePath("/checkout");
  revalidatePath("/account/addresses");
}

export async function updateUserAddress(formData: FormData) {
  const session = await getSession();
  if (!session?.user) {
    return null;
  }
  try {
    const addressId = formData.get("addressId") as string;
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const address1 = formData.get("address1") as string;
    const address2 = formData.get("address2") as string;
    const state = formData.get("state") as string;
    const zipcode = formData.get("zipcode") as string;
    const landmark = formData.get("landmark") as string;
    await prisma.address.update({
      where: {
        id: addressId,
        userId: session.user.id,
      },
      data: {
        name,
        email,
        phone,
        address1,
        address2,
        landmark,
        state,
        zipcode: Number(zipcode),
      },
    });
    revalidatePath("/account/addresses");
  } catch (error) {
    console.log(error);
    throw new Error("Failed to edit Address");
  }
}

export async function deleteAddress(addressId: string) {
  const session = await getSession();
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
