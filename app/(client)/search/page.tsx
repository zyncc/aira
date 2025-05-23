import ProductCard from "@/components/cards/productCard";
import prisma from "@/lib/prisma";
import { PackageSearch } from "lucide-react";
import { Suspense } from "react";
import SearchBar from "./searchBar";
import { Skeleton } from "@/components/ui/skeleton";
import { Product } from "@prisma/client";

type Props = {
  searchParams: Promise<{
    q?: string;
    size?: string;
    color?: string;
    price?: string;
  }>;
};

export default async function SearchPage({ searchParams }: Props) {
  return (
    <Suspense fallback={<SearchSkeleton />}>
      <SuspenseWrapper searchParams={searchParams} />
    </Suspense>
  );
}

async function SuspenseWrapper({ searchParams }: Props) {
  const { q, size, color, price } = await searchParams;

  let products: Product[] = [];

  if (q) {
    products = await prisma.product.findMany({
      where: {
        OR: [
          {
            title: {
              contains: q,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: q,
              mode: "insensitive",
            },
          },
        ],
      },
    });
  }

  return (
    <section className="py-8 container">
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-xl md:text-3xl font-bold tracking-tight">
              Search Products
            </h1>
          </div>
          <SearchBar initialQuery={q || ""} />
        </div>
        {q ? (
          <>
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">
                {products.length} {products.length === 1 ? "result" : "results"}{" "}
                for "{q}"
              </p>
              {(size || color || price) && (
                <p className="text-sm text-muted-foreground">
                  Filters applied: {size && `Size: ${size.toUpperCase()}`}{" "}
                  {color && `Color: ${color}`} {price && `Max Price: $${price}`}
                </p>
              )}
            </div>

            {products.length === 0 ? (
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
            ) : (
              <div className="grid grid-cols-2 px-2 md:px-0 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full md:pb-5 lg:pb-7">
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
            )}
          </>
        ) : (
          <div className="flex flex-col items-center w-full h-[60vh] justify-center py-12 px-4">
            <div className="relative mb-6">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary/20 to-primary/30 blur-lg" />
              <div className="relative bg-background rounded-full p-4">
                <PackageSearch className="w-12 h-12 text-primary" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center mb-3">
              Search for products
            </h2>
            <p className="text-muted-foreground text-center max-w-[400px] mb-6">
              Enter a search term to find products in our catalog.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function SearchSkeleton() {
  return (
    <section className="py-8 container">
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-24" />
          </div>
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
          {Array(8)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
