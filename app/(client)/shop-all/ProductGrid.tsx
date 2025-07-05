"use client";

import ProductCard from "@/components/cards/productCard";
import type { ProductsWithQuantity } from "@/lib/types";
import { Loader2, PackageSearch } from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ModernFilter from "@/components/Filter/ProductsFilter";

type Props = {
  products: ProductsWithQuantity[];
};

type ProductsResponse = {
  products: ProductsWithQuantity[];
  nextPage?: number;
};

export type SizesFilter = "sm" | "md" | "lg" | "xl";

export type ColorsFilter =
  | "red"
  | "blue"
  | "green"
  | "yellow"
  | "black"
  | "white";

export default function ProductGrid({ products }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { ref, inView } = useInView();
  const [allProducts, setAllProducts] =
    useState<ProductsWithQuantity[]>(products);

  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ["infiniteProducts"],
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    queryFn: async ({ pageParam = 1 }) => {
      const res = await fetch(
        `/api/infiniteQuery/fetchAllProducts?page=${pageParam}`
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

  useEffect(() => {
    const mergedProducts = data.pages.map((page) => page.products).flat();
    setAllProducts(mergedProducts);
  }, [data]);

  function sizeFilter(bool: boolean, value: string) {
    const params = new URLSearchParams(searchParams);
    if (bool) {
      params.set("size", value);
      return params;
    }
    params.delete("size");
    return params;
  }

  function colorFilter(bool: boolean, value: string) {
    const params = new URLSearchParams(searchParams);
    if (bool) {
      params.set("color", value);
      return params;
    }
    params.delete("color");
    return params;
  }

  function priceFilter(value: number) {
    const params = new URLSearchParams(searchParams);
    params.set("price", String(value));
    return params;
  }

  const filteredProducts = useMemo(() => {
    let tempProducts = [...allProducts];

    const color = searchParams.get("color");
    const size = searchParams.get("size");
    const price = searchParams.get("price");

    if (color) {
      tempProducts = tempProducts.filter((product) => product.color === color);
    }

    if (size) {
      tempProducts = tempProducts.filter(
        (product) =>
          product.quantity && product.quantity[size as SizesFilter] > 0
      );
    }

    if (price) {
      tempProducts = tempProducts.filter(
        (product) => product.price <= Number(price)
      );
    }

    return tempProducts;
  }, [searchParams, allProducts]);

  return (
    <div className="pb-[50px]">
      <div className="flex w-screen container justify-between mt-[30px] mb-6">
        <h1 className="font-bold text-2xl text-muted-foreground">
          All Products
        </h1>
        <div className="flex gap-x-4">
          <ModernFilter category={"shop-all"} />
        </div>
      </div>
      {filteredProducts.length === 0 && (
        <div className="flex flex-col items-center w-screen justify-center py-12 px-4">
          <div className="relative mb-6">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary/20 to-primary/30 blur-lg" />
            <div className="relative bg-background rounded-full p-4">
              <PackageSearch className="w-12 h-12 text-primary" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center mb-3">
            No Products found
          </h2>
          <p className="text-muted text-center max-w-[400px] mb-6">
            We couldn't find any products matching your current filters. Try
            adjusting your selection or start fresh.
          </p>
        </div>
      )}
      <div className="flex lg:container md:container lg:flex-row gap-8 items-start">
        <div className="grid grid-cols-2 md:px-0 md:grid-cols-3 lg:grid-cols-4 gap-1 md:gap-4 w-full md:pb-5 lg:pb-7">
          {filteredProducts.map((product) => (
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
          ))}
        </div>
      </div>

      {hasNextPage && filteredProducts.length >= 12 && (
        <div ref={ref} className="flex justify-center items-center w-full py-8">
          <div className="flex flex-col items-center">
            <Loader2 className={`w-8 h-8 text-primary animate-spin`} />
          </div>
        </div>
      )}
    </div>
  );
}
