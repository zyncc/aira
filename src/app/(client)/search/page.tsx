import { Container } from "@/components/container";
import ProductCard from "@/components/product-card";
import { db } from "@/db/instance";
import { Product } from "@/lib/types";
import { PackageSearch } from "lucide-react";
import { Metadata } from "next";
import SearchBar from "./_components/searchBar";

type Props = {
  searchParams: Promise<{
    q?: string;
    size?: string;
    color?: string;
    price?: string;
  }>;
};

export const metadata: Metadata = {
  title: "Search",
};

export default async function SearchPage({ searchParams }: Props) {
  return <SuspenseWrapper searchParams={searchParams} />;
}

async function SuspenseWrapper({ searchParams }: Props) {
  const { q } = await searchParams;

  let products: Product[] = [];

  if (q) {
    products = await db.query.product.findMany({
      where: (product, o) => o.ilike(product.title, `%${q}%`),
    });
  }

  return (
    <Container className="px-2 py-8">
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-xl font-bold tracking-tight md:text-3xl">
              Search Products
            </h1>
          </div>
          <SearchBar initialQuery={q || ""} />
        </div>
        {q ? (
          <>
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">
                {products.length} {products.length === 1 ? "result" : "results"} for
                &quot;{q}&quot;
              </p>
            </div>

            {products.length === 0 ? (
              <div className="flex h-[60vh] w-full flex-col items-center justify-center px-4 py-12">
                <div className="relative mb-6">
                  <div className="from-primary/20 to-primary/30 absolute -inset-1 rounded-full bg-gradient-to-r blur-lg" />
                  <div className="bg-background relative rounded-full p-4">
                    <PackageSearch className="text-primary h-12 w-12" />
                  </div>
                </div>
                <h2 className="mb-3 text-center text-2xl font-bold">No products found</h2>
                <p className="text-muted-foreground mb-6 max-w-[400px] text-center">
                  We couldn&apos;t find any products matching your current search.
                </p>
              </div>
            ) : (
              <div className="grid w-full grid-cols-2 gap-6 px-2 md:grid-cols-3 md:px-0 md:pb-5 lg:grid-cols-4 lg:pb-7">
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
          <div className="flex h-[60vh] w-full flex-col items-center justify-center px-4 py-12">
            <div className="relative mb-6">
              <div className="from-primary/20 to-primary/30 absolute -inset-1 rounded-full bg-gradient-to-r blur-lg" />
              <div className="bg-background relative rounded-full p-4">
                <PackageSearch className="text-primary h-12 w-12" />
              </div>
            </div>
            <h2 className="mb-3 text-center text-2xl font-bold">Search for products</h2>
            <p className="text-muted-foreground mb-6 max-w-[400px] text-center">
              Enter a search term to find products in our catalog.
            </p>
          </div>
        )}
      </div>
    </Container>
  );
}
