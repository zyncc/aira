import { Skeleton } from "@/components/ui/skeleton";

export default function SimilarProductsSkeleton() {
  return (
    <div className="container">
      <h1 className="text-2xl font-semibold mt-[80px] mb-10">
        Similar Products
      </h1>
      <div className="w-full mx-auto">
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="block rounded-lg overflow-hidden">
              <Skeleton className="aspect-square w-full" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
            <div className="hidden md:block rounded-lg overflow-hidden">
              <Skeleton className="aspect-square w-full" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
            <div className="hidden lg:block rounded-lg overflow-hidden">
              <Skeleton className="aspect-square w-full" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
