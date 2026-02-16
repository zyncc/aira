"use server";

import { ReturnReasonSchema } from "@/app/(client)/account/orders/[id]/_components/return-dialog";
import { db } from "@/db/instance";
import { returns } from "@/db/schema";
import {
  AuthErrorResponse,
  AuthorizationErrorResponse,
  ErrorResponse,
  SuccessResponse,
} from "@/lib/api-responses";
import { uuid } from "@/lib/utils";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { upperCase } from "lodash";
import { revalidatePath } from "next/cache";
import z from "zod";
import { getServerSession } from "../auth/get-server-session";

export async function CreateReturn(
  data: z.infer<typeof ReturnReasonSchema>,
  formData: FormData,
  type: "return" | "exchange",
  orderId: string,
) {
  const session = await getServerSession();
  if (!session) {
    return AuthErrorResponse();
  }

  const findOrder = await db.query.order.findFirst({
    where: (order, o) => o.eq(order.id, orderId),
    with: {
      returns: true,
    },
  });

  if (!findOrder) {
    return ErrorResponse("Order does not exist");
  }

  if (findOrder.userId !== session.user.id) {
    return AuthorizationErrorResponse();
  }

  const returnNotApproved = findOrder.returns?.approved == false;
  const returnFinalNotApproved = findOrder.returns?.finalApproved == false;

  if (returnNotApproved || returnFinalNotApproved) {
    return ErrorResponse("Return request has been declined");
  }

  let LastStatus;

  try {
    const res = await fetch(
      `https://track.delhivery.com/api/v1/packages/json/?waybill=${findOrder.waybill}`,
      {
        headers: {
          Authorization: process.env.DELHIVERY_TOKEN as string,
        },
      },
    );

    const fetchTrackingResponse = await res.json();
    LastStatus = fetchTrackingResponse.ShipmentData?.[0]?.Shipment?.Status;
  } catch (error) {
    console.error("Error fetching tracking data:", error);
    return ErrorResponse("Something went wrong, try again later");
  }

  const isDelivered = LastStatus.Status == "Delivered";
  const deliveryDate = new Date(LastStatus.StatusDateTime);
  const now = new Date();

  const diffMs = now.getTime() - deliveryDate.getTime();

  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  const inReturnWindow = isDelivered && diffDays <= 7;

  if (!inReturnWindow) {
    return ErrorResponse("Return window has expired");
  }

  const files = formData.getAll("files") as File[];

  const { arrayOfImages } = await uploadImages(files);

  await db.insert(returns).values({
    id: uuid(),
    userId: session.user.id,
    images: arrayOfImages,
    reason: data.reason,
    type,
    orderId,
  });

  revalidatePath(`/account/orders/${orderId}`);

  return SuccessResponse(upperCase(type) + " request created successfully");
}

async function uploadImages(images: File[]) {
  const s3 = new S3Client({
    region: process.env.S3_REGION as string,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
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

    const id = uuid();

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME as string,
      Key: `returns/${id}_${image.name}`,
      Body: buffer,
      ContentType: image.type,
    });

    await s3.send(command);

    return {
      url: `https://cdn.airaclothing.in/returns/${id}_${image.name}`,
    };
  });

  const results = await Promise.all(uploadPromises);

  const arrayOfImages = results.map((r) => r.url);

  return { arrayOfImages };
}
