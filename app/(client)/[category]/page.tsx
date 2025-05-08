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
  let validation;
  try {
    const { category } = await params;
    validation = categoryCheck.safeParse(category.replaceAll("-", " "));

    if (!validation.success) {
      return notFound();
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/cached/categoryProducts?category=${validation.data}`,
      {
        next: {
          revalidate: 20,
        },
      }
    );

    // Check if the response was successful
    if (!res.ok) {
      throw new Error(`API request failed with status ${res.status}`);
    }

    const products: Products[] = await res.json();

    // Optional: Validate the products data structure
    if (!Array.isArray(products)) {
      throw new Error("Invalid products data format");
    }

    return <ProductGrid products={products} category={validation.data} />;
  } catch (error) {
    console.error("Error in ProductGridWrapper:", error);

    // You have several options for error handling:
    // 1. Return notFound() if the category is invalid
    // 2. Return an error component
    // 3. Return empty state for the ProductGrid

    // Option 1: Return notFound (if error is due to invalid category)
    // return notFound();

    // Option 2: Return empty product grid with error message
    return (
      <div>
        <ProductGrid products={[]} category={validation?.data || ""} />
        <p className="text-center text-red-500 mt-4">
          Failed to load products. Please try again later.
        </p>
      </div>
    );

    // Option 3: Return a custom error component
    // return <ErrorComponent message="Failed to load products" />;
  }
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
