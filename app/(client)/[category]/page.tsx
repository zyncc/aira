import React, { Suspense } from "react";
import ProductGrid from "./ProductGrid";
import { Skeleton } from "@/components/ui/skeleton";
import { categoryCheck } from "@/lib/zodSchemas";
import { notFound } from "next/navigation";
import { Products } from "@/lib/types";

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
  // await new Promise<void>(
  //   (resolve) =>
  //     setTimeout(() => {
  //       resolve();
  //     }, 3000) // Simulates a 3-second delay
  // );
  const { category } = await params;
  const validation = categoryCheck.safeParse(category.replaceAll("-", " "));
  if (!validation.success) {
    return notFound();
  }
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/cached/categoryProducts?category=${validation.data.replaceAll(" ", "-")}`,
    {
      next: {
        revalidate: 86400,
        tags: [
          `${validation.data} Product}`,
          `${validation.data}`,
          "createdNewProduct",
        ],
      },
    }
  );

  const products: Products[] = await res.json();
  return <ProductGrid products={products} category={validation.data} />;
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
