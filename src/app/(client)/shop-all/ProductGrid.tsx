"use client";

import { Container } from "@/components/container";
import ProductCard from "@/components/product-card";
import type { Product } from "@/lib/types";
import { PackageSearch } from "lucide-react";

type Props = {
  products: Pick<
    Product,
    "id" | "images" | "placeholderImages" | "title" | "price" | "category" | "color"
  >[];
};

export type SizesFilter = "sm" | "md" | "lg" | "xl";

export type ColorsFilter = "red" | "blue" | "green" | "yellow" | "black" | "white";

export default function ProductGrid({ products }: Props) {
  return (
    <Container className="pb-[50px]">
      <div className="mt-[30px] mb-6 flex w-screen justify-between px-2">
        <h1 className="text-muted-foreground text-2xl font-medium">All Products</h1>
      </div>
      {products.length === 0 && (
        <div className="flex w-screen flex-col items-center justify-center px-4 py-12">
          <div className="relative mb-6">
            <div className="from-primary/20 to-primary/30 absolute -inset-1 rounded-full bg-gradient-to-r blur-lg" />
            <div className="bg-background relative rounded-full p-4">
              <PackageSearch className="text-primary h-12 w-12" />
            </div>
          </div>
          <h2 className="mb-3 text-center text-2xl font-bold">No Products found</h2>
          <p className="text-muted mb-6 max-w-[400px] text-center">
            We couldn&apos;t find any products matching your current filters. Try
            adjusting your selection or start fresh.
          </p>
        </div>
      )}
      <div className="flex items-start gap-8 min-md:px-2 lg:flex-row">
        <div className="grid w-full grid-cols-2 gap-1 md:grid-cols-3 md:gap-4 md:px-0 md:pb-5 lg:grid-cols-4 lg:pb-7">
          {products.map((product) => (
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
    </Container>
  );
}
