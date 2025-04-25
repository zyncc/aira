import InfiniteReviews from "@/app/(client)/[category]/[id]/components/InfiniteReviews";
import { Card, CardContent } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import Image from "next/image";
import React from "react";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page(props: Params) {
  const params = await props.params;
  const { id } = params;

  const reviews = await prisma.reviews.findMany({
    where: {
      productId: id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          id: true,
          image: true,
          name: true,
        },
      },
    },
    take: 10,
  });
  const product = await prisma.product.findUnique({
    where: {
      id,
    },
  });
  return (
    <section className="container my-[100px] flex flex-wrap gap-10">
      <div className="flex-1 flex flex-col gap-4 min-w-[320px] max-w-full sticky">
        <h1 className="text-3xl font-semibold">All Reviews</h1>
        <Image
          src={product?.images[0]!}
          height={400}
          width={400}
          alt="Product Image"
          className="object-cover aspect-square rounded-lg"
        />
        <h1 className="font-medium text-xl">{product?.title}</h1>
        <p>{product?.description}</p>
      </div>
      {reviews.length == 0 ? (
        <div className="flex-1">
          <h1 className="font-medium text-xl">This product has no reviews</h1>
        </div>
      ) : (
        <div className="flex-1 space-y-5">
          <InfiniteReviews review={reviews} />
        </div>
      )}
    </section>
  );
}
