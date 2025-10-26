import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="relative flex w-full flex-wrap gap-2 px-0 pb-[30px] max-[768px]:pt-0 md:mt-[30px] md:flex-nowrap">
      {/* Image Carousel Skeleton */}
      <div className="md:basis-1/2 md:px-2">
        <div className="embla flex flex-col gap-x-3 lg:flex-row lg:items-start">
          <div className="w-full md:rounded-lg lg:order-2">
            <Skeleton className="aspect-[2/3] md:rounded-lg" />
          </div>
          <div className="pl-4 max-lg:mt-2 max-lg:overflow-x-hidden lg:order-1 lg:w-fit lg:pl-2">
            <div className="flex gap-2 lg:w-[70px] lg:flex-col">
              {[...Array(5)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="aspect-square h-[70px] w-[70px] rounded-md"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Skeleton */}
      <div className="w-full px-2 md:basis-1/2">
        <div className="flex flex-col gap-3 md:basis-1/2">
          {/* Title and Price */}
          <div>
            <Skeleton className="mb-2 h-8 w-3/4" />
            <Skeleton className="h-6 w-1/3" />
          </div>

          {/* Size Selection */}
          <div className="mb-2">
            <Skeleton className="mb-3 h-5 w-24" />
            <div className="flex flex-wrap gap-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-12 rounded-full" />
              ))}
            </div>
          </div>
        </div>

        {/* Add to Cart Buttons */}
        <div className="mt-5 flex flex-col gap-3">
          <Skeleton className="h-12 w-full rounded-full" />
          <Skeleton className="h-12 w-full rounded-full" />
        </div>

        {/* Shipping Info */}
        <div className="mt-6 space-y-4">
          <div className="flex justify-center gap-3 py-2 md:flex-col">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-40" />
          </div>

          {/* Pincode Form */}
          <div className="space-y-2">
            <Skeleton className="mb-2 h-5 w-48" />
            <div className="flex gap-2">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-20" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-4 space-y-4">
          <div className="flex gap-2">
            <Skeleton className="h-12 flex-1 rounded-md" />
            <Skeleton className="h-12 flex-1 rounded-md" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
      </div>
    </div>
  );
}
