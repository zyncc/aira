import React, { Suspense } from "react";
import ProductGrid from "./ProductGrid";
import { Skeleton } from "@/components/ui/skeleton";
import { categories, categoryCheck } from "@/lib/zodSchemas";
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
      },
    }
  );

  const products: Products[] = await res.json();
  return <ProductGrid products={products} category={validation.data} />;
}

function ProductsSkeleton() {
  return (
    <div className="pt-[100px] md:container px-2">
      <div className="flex justify-between">
        <Skeleton className="h-8 w-32 aspect-square rounded-lg" />
      </div>
      <div className="md:m-2 grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-3 md:gap-5 lg:gap-7 py-5">
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
