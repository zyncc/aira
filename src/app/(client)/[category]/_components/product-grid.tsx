"use client";

import { Container } from "@/components/container";
import ProductCard from "@/components/product-card";
import type { Product } from "@/lib/types";
import _ from "lodash";
import { PackageSearch } from "lucide-react";

type Props = {
  products: Pick<
    Product,
    "id" | "images" | "placeholderImages" | "title" | "price" | "category" | "color"
  >[];
  category: string;
};

export type SizesFilter = "sm" | "md" | "lg" | "xl";

export type ColorsFilter = "red" | "blue" | "green" | "yellow" | "black" | "white";

export default function ProductGrid({ products, category }: Props) {
  return (
    <div className="px-0 pb-[50px]">
      <Container className="mt-[30px] mb-6 flex justify-between">
        <h1 className="text-muted-foreground px-2 text-2xl font-medium">
          {_.capitalize(category.replaceAll("-", " "))}
        </h1>
      </Container>
      {products.length === 0 && (
        <Container className="flex w-screen flex-col items-center justify-center py-12">
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
        </Container>
      )}
      <Container className="flex items-start gap-8 min-md:px-2 lg:flex-row">
        <div className="grid w-full grid-cols-2 gap-0 md:grid-cols-3 md:gap-4 md:px-0 md:pb-5 lg:grid-cols-4 lg:pb-7">
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
      </Container>
    </div>
  );
}
