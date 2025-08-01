import React, { Suspense } from "react";
import ProductGrid from "./ProductGrid";
import { Skeleton } from "@/components/ui/skeleton";
import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import { categories, categoryCheck } from "@/lib/zodSchemas";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { capitalizeFirstLetter } from "@/lib/caplitaliseFirstLetter";

export async function generateStaticParams() {
  return categories.map((category) => ({
    category: category.replaceAll(" ", "-").toLowerCase(),
  }));
}

export default async function Categories({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  return (
    <Suspense fallback={<ProductsSkeleton />}>
      <ProductGridWrapper params={params} />
    </Suspense>
  );
}

async function ProductGridWrapper({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const validation = categoryCheck.safeParse(
    category.replaceAll("-", " ").toLowerCase()
  );

  if (!validation.success) {
    return notFound();
  }

  const getProducts = unstable_cache(
    async () => {
      return prisma.product.findMany({
        where: {
          category: category.replaceAll("-", " "),
          isArchived: false,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          quantity: true,
        },
        take: 12,
      });
    },
    [category],
    {
      revalidate: 86400,
      tags: ["createdNewProduct"],
    }
  );

  const products = await getProducts();

  return <ProductGrid products={products} category={category} />;
}

function ProductsSkeleton() {
  return (
    <div className="mt-[30px] md:container">
      <div className="flex justify-between px-2">
        <Skeleton className="h-8 w-24 aspect-square rounded-md" />
        <Skeleton className="h-8 w-24 aspect-square rounded-md" />
      </div>
      <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-x-1 gap-y-3 md:gap-5 lg:gap-7 py-5">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="w-[100%]">
            <Skeleton className="w-full aspect-[2/3] rounded-none" />
            <div className="px-1">
              <Skeleton className="w-[80%] h-[20px] mt-2 max-w-[768px]:ml-2" />
              <Skeleton className="w-[65%] h-[20px] mt-2 max-w-[768px]:ml-2 max-w-[768px]:mb-2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  return {
    metadataBase: new URL("https://airaclothing.in"),
    title: `${capitalizeFirstLetter(category.replaceAll("-", " "))}`,
    description: "Affordable Summer Clothing made from 100% Linen Fabric",
  };
}
