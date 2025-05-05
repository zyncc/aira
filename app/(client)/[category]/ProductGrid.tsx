"use client";

import ProductCard from "@/components/cards/productCard";
import type { Products } from "@/lib/types";
import { capitalizeFirstLetter } from "@/lib/caplitaliseFirstLetter";
import { Loader2, PackageSearch, SlidersHorizontal } from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  products: Products[];
  category: string;
};

type ProductsResponse = {
  products: Products[];
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

export default function ProductGrid({ products, category }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { ref, inView } = useInView();
  const [allProducts, setAllProducts] = useState<Products[]>(products);

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
    <div>
      <div className="flex w-screen container justify-between mt-[100px] mb-6">
        <h1 className="font-semibold text-2xl">
          {capitalizeFirstLetter(category.replaceAll("-", " "))}
        </h1>
        <div className="flex gap-x-4">
          <Button
            onClick={() => {
              router.replace(`/${category}`);
            }}
          >
            Clear Filters
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant={"secondary"}>
                <SlidersHorizontal />
                Filter
              </Button>
            </SheetTrigger>
            <SheetContent className="z-[100] p-0">
              <SheetHeader className="px-3 py-4 border-b">
                <SheetTitle>Filter & Sort</SheetTitle>
              </SheetHeader>
              <div className="py-2">
                <Accordion type="multiple">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="px-3">Size</AccordionTrigger>
                    <AccordionContent className="px-3 space-y-4">
                      <div className="flex justify-between items-center">
                        <h4>Small</h4>
                        <Switch
                          checked={searchParams.get("size") === "sm"}
                          onCheckedChange={(e) => {
                            const searchParams = sizeFilter(e, "sm");
                            router.replace(
                              `/${category}?${searchParams.toString()}`
                            );
                          }}
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <h4>Medium</h4>
                        <Switch
                          checked={searchParams.get("size") === "md"}
                          onCheckedChange={(e) => {
                            const searchParams = sizeFilter(e, "md");
                            router.replace(
                              `/${category}?${searchParams.toString()}`
                            );
                          }}
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <h4>Large</h4>
                        <Switch
                          checked={searchParams.get("size") === "lg"}
                          onCheckedChange={(e) => {
                            const searchParams = sizeFilter(e, "lg");
                            router.replace(
                              `/${category}?${searchParams.toString()}`
                            );
                          }}
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <h4>Extra Large</h4>
                        <Switch
                          checked={searchParams.get("size") === "xl"}
                          onCheckedChange={(e) => {
                            const searchParams = sizeFilter(e, "xl");
                            router.replace(
                              `/${category}?${searchParams.toString()}`
                            );
                          }}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger className="px-3">Colors</AccordionTrigger>
                    <AccordionContent className="px-3 space-y-4">
                      <div className="flex justify-between items-center">
                        <h4>Red</h4>
                        <Switch
                          checked={searchParams.get("color") == "red"}
                          onCheckedChange={(bool) => {
                            const searchParams = colorFilter(bool, "red");
                            router.replace(
                              `/${category}?${searchParams.toString()}`
                            );
                          }}
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <h4>Blue</h4>
                        <Switch
                          checked={searchParams.get("color") == "blue"}
                          onCheckedChange={(bool) => {
                            const searchParams = colorFilter(bool, "blue");
                            router.replace(
                              `/${category}?${searchParams.toString()}`
                            );
                          }}
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <h4>Black</h4>
                        <Switch
                          checked={searchParams.get("color") == "black"}
                          onCheckedChange={(bool) => {
                            const searchParams = colorFilter(bool, "black");
                            router.replace(
                              `/${category}?${searchParams.toString()}`
                            );
                          }}
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <h4>Green</h4>
                        <Switch
                          checked={searchParams.get("color") == "green"}
                          onCheckedChange={(bool) => {
                            const searchParams = colorFilter(bool, "green");
                            router.replace(
                              `/${category}?${searchParams.toString()}`
                            );
                          }}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger className="px-3">Price</AccordionTrigger>
                    <AccordionContent className="px-3 space-y-4">
                      <div className="py-2">
                        <Slider
                          min={1000}
                          max={4000}
                          step={250}
                          defaultValue={[
                            parseInt(searchParams.get("price") || "0"),
                            4000,
                          ]}
                          onValueChange={(value) => {
                            const searchParams = priceFilter(value[0]);
                            router.replace(
                              `/${category}?${searchParams.toString()}`
                            );
                          }}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </SheetContent>
          </Sheet>
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
