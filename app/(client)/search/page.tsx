import ProductCard from "@/components/cards/productCard";
import prisma from "@/lib/prisma";
import { PackageSearch } from "lucide-react";
import React, { Suspense } from "react";
import SearchBar from "./searchBar";
import { Label } from "@/components/ui/label";
import SearchFilter from "./searchFilter";

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
  const products = await prisma.product.findMany({
    where: {
      isArchived: false,
      OR: [{ title: { contains: q, mode: "insensitive" } }],
    },
    orderBy: { createdAt: "desc" },
  });
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
      {products.length === 0 && (
        <div className="flex flex-col items-center w-full h-[60vh] justify-center py-12 px-4">
          <div className="relative mb-6">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary/20 to-primary/30 blur-lg" />
            <div className="relative bg-background rounded-full p-4">
              <PackageSearch className="w-12 h-12 text-primary" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center mb-3">
            No products found
          </h2>
          <p className="text-muted-foreground text-center max-w-[400px] mb-6">
            We couldn't find any products matching your current search.
          </p>
        </div>
      )}
      <div className="grid grid-cols-2 px-2 md:px-0 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full md:pb-5 lg:pb-7 py-10">
        {products.map((product, key) => (
          <ProductCard
            key={key}
            image={product.images[0]}
            title={product.title}
            price={product.price}
            color={product.color}
            category={product.category}
            placeholder={product.placeholderImages[0]}
            id={product.id}
          />
        ))}
      </div>
    </section>
  );
}

type FilterSectionProps = {
  title: string;
  options: string[];
  selectedOptions: string[];
  onChange: (value: string) => void;
};

function FilterSection({
  title,
  options,
  selectedOptions,
  onChange,
}: FilterSectionProps) {
  return (
    <div>
      <Label>{title}</Label>
      <div className="space-y-2 mt-2">
        {options.map((option) => (
          <div key={option} className="flex items-center">
            <input
              type="checkbox"
              id={option}
              checked={selectedOptions.includes(option)}
              onChange={() => onChange(option)}
              className="mr-2"
            />
            <label htmlFor={option}>
              {(option == "sm" && "Small") ||
                (option == "md" && "Medium") ||
                (option == "lg" && "Large") ||
                (option == "xl" && "XL") ||
                option}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
