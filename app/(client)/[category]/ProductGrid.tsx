"use client";

import ProductCard from "@/components/cards/productCard";
import type { Products } from "@/lib/types";
import { capitalizeFirstLetter } from "@/lib/caplitaliseFirstLetter";
import { Loader2, PackageSearch } from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

type Props = {
  products: Products[];
  category: string;
};

type ProductsResponse = {
  products: Products[];
  nextPage?: number;
};

export default function ProductGrid({ products, category }: Props) {
  const { ref, inView } = useInView();
  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ["infiniteProducts", category],
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    queryFn: async ({ pageParam = 1 }) => {
      const res = await fetch(
        `/api/infiniteQuery/categoryProducts?page=${pageParam}&category=${category}`
      );
      return (await res.json()) as ProductsResponse;
    },
    initialPageParam: 1,
    initialData: {
      pages: [
        {
          products,
          nextPage: 2,
        },
      ],
      pageParams: [1],
    },
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
  });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);
  return (
    <div>
      <div className="flex w-screen container justify-between mt-[100px] mb-6">
        <h1 className="font-semibold text-2xl">
          {capitalizeFirstLetter(category)}
        </h1>
      </div>
      {data.pages[0].products.length === 0 && (
        <div className="flex flex-col items-center w-screen justify-center py-12 px-4">
          <div className="relative mb-6">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary/20 to-primary/30 blur-lg" />
            <div className="relative bg-background rounded-full p-4">
              <PackageSearch className="w-12 h-12 text-primary" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center mb-3">
            No matches found
          </h2>
          <p className="text-muted text-center max-w-[400px] mb-6">
            We couldn't find any products matching your current filters. Try
            adjusting your selection or start fresh.
          </p>
        </div>
      )}
      <div className="flex lg:container md:container lg:flex-row gap-8 items-start">
        <div className="grid grid-cols-2 px-2 md:px-0 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full md:pb-5 lg:pb-7">
          {data.pages?.map((product) =>
            product.products.map((product) => (
              <ProductCard
                key={product.id}
                image={product.images[0]}
                placeholder={product.placeholderImages[0]}
                title={product.title}
                price={product.price}
                category={product.category}
                color={product.color}
                id={product.id}
              />
            ))
          )}
        </div>
      </div>

      {hasNextPage && (
        <div ref={ref} className="flex justify-center items-center w-full py-8">
          <div className="flex flex-col items-center">
            <Loader2 className={`w-8 h-8 text-primary animate-spin`} />
          </div>
        </div>
      )}
    </div>
  );
}
