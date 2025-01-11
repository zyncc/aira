import ProductCard from "@/components/cards/productCard";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { SlidersHorizontal } from "lucide-react";
import React from "react";
import SearchBar from "./searchBar";
import SearchPagePaginationComponent from "@/components/Pagination";

type Props = {
  searchParams: {
    q: string;
    page: string;
  };
};

const noOfProducts = 24;

export default async function SearchPage({ searchParams: { q, page } }: Props) {
  let skip: number;
  const pageNumber = Number(page) || 1;
  if (pageNumber == 1) {
    skip = 0;
  } else {
    skip = noOfProducts * (pageNumber - 1);
  }
  console.log(skip);
  const products = await prisma.product.findMany({
    where: {
      isArchived: false,
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ],
    },
    skip,
    take: noOfProducts,
    orderBy: { createdAt: "desc" },
  });
  const number = [];
  for (let i = 1; i <= 10; i++) number.push(i);
  return (
    <section className="py-[100px] container">
      <div>
        <div className="">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-bold">Search</h1>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="hidden sm:flex">
                Reset Filters
              </Button>
              <Button className="gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>
          <SearchBar />
        </div>
      </div>
      <div className="md:m-2 grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 md:gap-5 lg:gap-7 py-10">
        {products.map((product, key) => (
          <ProductCard
            key={key}
            image={product.images[0]}
            title={product.title}
            price={product.price}
            color={product.color[0]}
            category={product.category}
            placeholder={product.placeholderImages[0]}
            id={product.id}
          />
        ))}
      </div>
      <SearchPagePaginationComponent
        noOfProducts={noOfProducts}
        productsLength={products.length}
      />
    </section>
  );
}
