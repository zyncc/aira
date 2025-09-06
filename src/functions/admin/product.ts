"use server";

import { quantitySchema } from "@/app/(admin)/admin/products/_components/edit-quantity";
import { db } from "@/db/instance";
import { product, quantity } from "@/db/schema";
import { AuthorizationErrorResponse } from "@/lib/api-responses";
import { uuid } from "@/lib/utils";
import { CreateProductFormSchema } from "@/lib/zod-schemas";
import { eq } from "drizzle-orm";
import ImageKit from "imagekit";
import { revalidatePath } from "next/cache";
import { getPlaiceholder } from "plaiceholder";
import z from "zod";
import { getServerSession } from "../auth/get-server-session";

async function uploadImages(images: File[]) {
  const imagekit = new ImageKit({
    publicKey: process.env.IMAGE_KIT_PUBLIC_API_KEY as string,
    privateKey: process.env.IMAGE_KIT_PRIVATE_API_KEY as string,
    urlEndpoint: process.env.IMAGE_KIT_URL_ENDPOINT as string,
  });

  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

  const uploadPromises = images.map(async (image) => {
    if (!allowedTypes.includes(image.type)) {
      throw new Error(`Unsupported file type: ${image.type}`);
    }

    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (!buffer || buffer.length < 1024) {
      throw new Error("Image buffer is empty or too small");
    }

    const { base64 } = await getPlaiceholder(buffer);

    const extension = image.type.split("/")[1];

    const response = await imagekit.upload({
      file: buffer,
      fileName: `${uuid(5).slice(0, 5)}.${extension}`,
      folder: "products",
      useUniqueFileName: true,
    });

    return {
      url: response.url,
      placeholder: base64,
    };
  });

  const results = await Promise.all(uploadPromises);

  const arrayOfImages = results.map((r) => r.url);
  const placeholderImages = results.map((r) => r.placeholder);

  return { arrayOfImages, placeholderImages };
}

export async function createProduct(
  data: z.infer<typeof CreateProductFormSchema>,
  formData: FormData,
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
    height,
    isArchived,
    isFeatured,
    largeQuantity: lg,
    mediumQuantity: md,
    length,
    price,
    smallQuantity: sm,
    title,
    weight,
    xlQuantity: xl,
    doubleXlQuantity: doublexl,
  } = data;

  const images = formData.getAll("images") as File[];

  let imagesURIs: string[] = [];
  let placeholderImages: string[] = [];

  if (images.length === 0) {
    throw new Error("No image provided");
  }

  const uploaded = await uploadImages(images);
  imagesURIs = uploaded.arrayOfImages;
  placeholderImages = uploaded.placeholderImages;

  try {
    const [newProduct] = await db
      .insert(product)
      .values({
        id: uuid(),
        title,
        breadth,
        category,
        color,
        description,
        height,
        images: imagesURIs,
        placeholderImages: placeholderImages,
        length,
        isArchived,
        isFeatured,
        price,
        weight,
      })
      .returning({ id: product.id });

    await db.insert(quantity).values({
      id: uuid(),
      productId: newProduct.id,
      doublexl,
      lg,
      md,
      sm,
      xl,
    });
  } catch (error) {
    console.log(error);
    throw Error("Failed to create product");
  } finally {
    revalidatePath(`/${category.replaceAll(" ", "-")}`);
    revalidatePath("/shop-all");
  }
}

export async function updateQuantity(values: z.infer<typeof quantitySchema>, id: string) {
  const session = await getServerSession();

  if (session?.user.role != "admin") {
    return AuthorizationErrorResponse();
  }

  await db
    .update(quantity)
    .set({
      ...values,
    })
    .where(eq(quantity.id, id));
}
