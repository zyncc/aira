import React, { Suspense } from "react";
import ProductGrid from "./ProductGrid";
import { Skeleton } from "@/components/ui/skeleton";
import { categoryCheck } from "@/lib/zodSchemas";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";

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
  const validation = categoryCheck.safeParse(category);
  if (!validation.success) {
    return notFound();
  }
  async function fetchProducts() {
    const products = await prisma.product.findMany({
      where: {
        category: validation.data,
        isArchived: false,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        quantity: true,
      },
    });
    return products;
  }
  const products = await fetchProducts();
  return <ProductGrid products={products} category={validation.data} />;
}

function ProductsSkeleton() {
  return (
    <div className="pt-[100px] md:container">
      <div className="flex justify-between container">
        <Skeleton className="h-8 w-32 aspect-square rounded-lg" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-32 aspect-square rounded-lg" />
          <Skeleton className="h-8 w-32 aspect-square rounded-lg" />
        </div>
      </div>
      <div className="md:m-2 grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-[2px] md:gap-5 lg:gap-7 py-10">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="w-[100%]">
            <Skeleton className="w-full aspect-square rounded-lg" />
            <Skeleton className="w-[80%] h-[20px] mt-2 max-w-[768px]:ml-2" />
            <Skeleton className="w-[65%] h-[20px] mt-2 max-w-[768px]:ml-2 max-w-[768px]:mb-2" />
          </div>
        ))}
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const categories = [
    "men",
    "co-ord-sets",
    "pants",
    "jumpsuits",
    "shorts",
    "dresses",
    "outerwear",
    "tops",
    "skirts",
    "lounge-wear",
  ];
  return categories.map((category) => ({
    category,
  }));
}
