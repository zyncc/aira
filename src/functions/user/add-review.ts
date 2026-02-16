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
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
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
        operators.eq(order.userId, session.user.id),
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
        operators.eq(review.userId, session.user.id),
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

  const s3 = new S3Client({
    region: process.env.S3_REGION as string,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
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

      const id = uuid();

      const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME as string,
        Key: `reviews/${id}_${image.name}`,
        Body: buffer,
        ContentType: image.type,
      });

      await s3.send(command);

      return `https://cdn.airaclothing.in/reviews/${id}_${image.name}`;
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
