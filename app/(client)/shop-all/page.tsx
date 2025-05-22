import React, { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import ProductGrid from "./ProductGrid";
import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export default async function Categories() {
  return (
    <Suspense fallback={<ProductsSkeleton />}>
      <ProductGridWrapper />
    </Suspense>
  );
}

async function ProductGridWrapper() {
  const getProducts = unstable_cache(
    async () => {
      return prisma.product.findMany({
        where: {
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
    ["createdNewProduct"],
    {
      revalidate: 86400,
    }
  );

  const products = await getProducts();

  return <ProductGrid products={products} />;
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
