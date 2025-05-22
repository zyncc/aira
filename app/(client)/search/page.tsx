import ProductCard from "@/components/cards/productCard";
import prisma from "@/lib/prisma";
import { PackageSearch } from "lucide-react";
import React, { Suspense } from "react";
import SearchBar from "./searchBar";
import SearchFilter from "./searchFilter";
import { Product } from "@prisma/client";

type Props = {
  searchParams: Promise<{
    q: string;
  }>;
};

export default async function SearchPage({ searchParams }: Props) {
  return (
    <Suspense fallback={"loading..."}>
      <SuspenseWrapper searchParams={searchParams} />
    </Suspense>
  );
}

async function SuspenseWrapper({ searchParams }: Props) {
  const { q } = await searchParams;

  return (
    <section className="py-[100px] container">
      <div>
        <div>
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-bold">Search</h1>
            <SearchFilter />
          </div>
          <SearchBar />
        </div>
      </div>
      {/*{products.length === 0 && (*/}
      {/*  <div className="flex flex-col items-center w-full h-[60vh] justify-center py-12 px-4">*/}
      {/*    <div className="relative mb-6">*/}
      {/*      <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary/20 to-primary/30 blur-lg" />*/}
      {/*      <div className="relative bg-background rounded-full p-4">*/}
      {/*        <PackageSearch className="w-12 h-12 text-primary" />*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*    <h2 className="text-2xl font-bold text-center mb-3">*/}
      {/*      No products found*/}
      {/*    </h2>*/}
      {/*    <p className="text-muted-foreground text-center max-w-[400px] mb-6">*/}
      {/*      We couldn't find any products matching your current search.*/}
      {/*    </p>*/}
      {/*  </div>*/}
      {/*)}*/}
      <div className="grid grid-cols-2 px-2 md:px-0 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full md:pb-5 lg:pb-7 py-10">
        {/*{products.map((product, key) => (*/}
        {/*  <ProductCard*/}
        {/*    key={key}*/}
        {/*    image={product.images[0]}*/}
        {/*    title={product.title}*/}
        {/*    price={product.price}*/}
        {/*    color={product.color}*/}
        {/*    category={product.category}*/}
        {/*    placeholder={product.placeholderImages[0]}*/}
        {/*    id={product.id}*/}
        {/*  />*/}
        {/*))}*/}
      </div>
    </section>
  );
}
