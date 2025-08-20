"use server";

import { db } from "@/db/instance";
import { reviews } from "@/db/schema";
import {
  AuthErrorResponse,
  AuthorizationErrorResponse,
  ErrorResponse,
  SuccessResponse,
} from "@/lib/api-responses";
import { uuid } from "@/lib/utils";
import { ReviewFormSchema } from "@/lib/zod-schemas";
import ImageKit from "imagekit";
import { revalidatePath } from "next/cache";
import z from "zod";
import { getServerSession } from "../auth/get-server-session";

export async function uploadReview(
  data: z.infer<typeof ReviewFormSchema>,
  id: string,
  category: string,
  ImageData?: FormData,
) {
  const session = await getServerSession();
  if (!session) {
    return AuthErrorResponse();
  }

  const { success } = ReviewFormSchema.safeParse(data);
  if (!success) {
    return ErrorResponse("Invalid data");
  }

  const checkIfUserHasOrdered = await db.query.order.findFirst({
    where: (order, operators) =>
      operators.and(
        operators.eq(order.userId, session?.user.id ?? ""),
        operators.eq(order.productId, id),
        operators.eq(order.paymentSuccess, true),
      ),
  });

  if (!checkIfUserHasOrdered) {
    return AuthorizationErrorResponse();
  }

  const checkIfUserHasReviewed = await db.query.reviews.findFirst({
    where: (review, operators) =>
      operators.and(
        operators.eq(review.userId, session?.user.id ?? ""),
        operators.eq(review.productId, id),
      ),
  });

  if (checkIfUserHasReviewed) {
    return ErrorResponse("You have already reviewed this product", {
      code: 400,
    });
  }

  const imageSizeLimit = 2 * 1024 * 1024;
  const { title, description } = data;
  const images = ImageData?.getAll("images") as File[];

  // Check image size
  images.forEach((image) => {
    if (image.size > imageSizeLimit) {
      return ErrorResponse("Image size more than 2mb", {
        code: 400,
      });
    }
  });

  if (images.length > 0) {
    const imagesURIs = await uploadImages(images);
    await db.insert(reviews).values({
      id: uuid(),
      productId: id,
      title,
      description,
      images: imagesURIs,
      userId: session.user.id,
    });
    revalidatePath(`/${category}/${id}`);
    return SuccessResponse("Review uploaded successfully");
  }

  await db.insert(reviews).values({
    id: uuid(),
    productId: id,
    title,
    description,
    userId: session.user.id,
  });

  revalidatePath(`/${category}/${id}`);

  return SuccessResponse("Review uploaded successfully");
}

async function uploadImages(images: File[]) {
  const arrayOfImages: string[] = [];
  const imagekit = new ImageKit({
    publicKey: process.env.IMAGE_KIT_PUBLIC_API_KEY as string,
    privateKey: process.env.IMAGE_KIT_PRIVATE_API_KEY as string,
    urlEndpoint: process.env.IMAGE_KIT_URL_ENDPOINT as string,
  });

  const uploadPromises = images.map(async (image) => {
    try {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(image.type)) {
        throw new Error(`Unsupported file type: ${image.type}`);
      }

      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      if (!buffer || buffer.length < 1024) {
        throw new Error("Image buffer is empty or too small");
      }

      const extension = image.type.split("/")[1];

      const response = await imagekit.upload({
        file: buffer,
        fileName: `${uuid(5).slice(0, 5)}.${extension}`,
        folder: "reviews",
        useUniqueFileName: true,
      });

      console.log("Upload success:", response.url);
      return response.url;
    } catch (error) {
      console.error("Upload failed:", error);
      throw error;
    }
  });

  const results = await Promise.allSettled(uploadPromises);
  results.forEach((result) => {
    if (result.status === "fulfilled") {
      arrayOfImages.push(result.value as string);
    } else {
      console.error("Failed to upload an image:", result.reason);
    }
  });

  return arrayOfImages;
}
