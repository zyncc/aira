import { Container } from "@/components/container";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";

export default function SearchSkeleton() {
  return (
    <Container className="px-2 py-8">
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-xl font-bold tracking-tight md:text-3xl">
              Search Products
            </h1>
          </div>

          {/* Search Bar - disabled input */}
          <div className="relative">
            <div className="relative rounded-md">
              <Input
                type="text"
                placeholder="Search products..."
                className="h-12 pr-10 pl-10 text-base"
                disabled
              />
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
            </div>
          </div>
        </div>
        {/* Product grid skeleton */}
        <div className="grid w-full grid-cols-2 gap-6 px-2 md:grid-cols-3 md:px-0 md:pb-5 lg:grid-cols-4 lg:pb-7">
          {Array.from({ length: 4 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </Container>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="flex flex-col space-y-3">
      {/* Product image */}
      <Skeleton className="aspect-3/4 w-full rounded-lg" />

      {/* Product title */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      {/* Product price */}
      <Skeleton className="h-5 w-20" />
    </div>
  );
}
