import React, { Suspense } from "react";
import ProductGrid from "./ProductGrid";
import { Skeleton } from "@/components/ui/skeleton";
import { categoryCheck } from "@/lib/zodSchemas";
import { notFound } from "next/navigation";
import { Products } from "@/lib/types";
import type { ProductGroup } from "schema-dts";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const category = (await params).category;
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
  // const structuredProductGroup: ProductGroup[] = [
  //   {
  //     "@context": "https://schema.org",
  //     "@type": "ProductGroup",
  //     "@id": "#coat_parent",
  //     name: "Wool winter coat",
  //     description: "Wool coat, new for the coming winter season",
  //     url: "https://www.example.com/coat",
  //     // ... other ProductGroup-level properties
  //     brand: {
  //       "@type": "Brand",
  //       name: "Good brand",
  //     },
  //     productGroupID: "44E01",
  //     variesBy: ["https://schema.org/size", "https://schema.org/color"],
  //   },
  //   {
  //     "@context": "https://schema.org",
  //     "@type": "Product",
  //     isVariantOf: { "@id": "#coat_parent" },
  //     name: "Small green coat",
  //     description: "Small wool green coat for the winter season",
  //     image: "https://www.example.com/coat_small_green.jpg",
  //     size: "small",
  //     color: "green",
  //     // ... other Product-level properties
  //     offers: {
  //       "@type": "Offer",
  //       url: "https://www.example.com/coat?size=small&color=green",
  //       price: 39.99,
  //       priceCurrency: "USD",
  //       // ... other offer-level properties
  //     },
  //   },
  //   {
  //     "@context": "https://schema.org",
  //     "@type": "Product",
  //     isVariantOf: { "@id": "#coat_parent" },
  //     name: "Small dark blue coat",
  //     description: "Small wool light blue coat for the winter season",
  //     image: "https://www.example.com/coat_small_lightblue.jpg",
  //     size: "small",
  //     color: "light blue",
  //     // ... other Product-level properties
  //     offers: {
  //       "@type": "Offer",
  //       url: "https://www.example.com/coat?size=small&color=lightblue",
  //       price: 39.99,
  //       priceCurrency: "USD",
  //       // ... other offer-level properties
  //     },
  //   },
  //   {
  //     "@context": "https://schema.org",
  //     "@type": "Product",
  //     isVariantOf: { "@id": "#coat_parent" },
  //     name: "Large light blue coat",
  //     description: "Large wool light blue coat for the winter season",
  //     image: "https://www.example.com/coat_large_lightblue.jpg",
  //     size: "large",
  //     color: "light blue",
  //     // ... other Product-level properties
  //     offers: {
  //       "@type": "Offer",
  //       url: "https://www.example.com/coat?size=large&color=lightblue",
  //       price: 49.99,
  //       priceCurrency: "USD",
  //       // ... other offer-level properties
  //     },
  //   },
  // ];
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
