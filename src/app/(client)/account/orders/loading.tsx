import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Your Orders</h1>
            <p className="text-foreground">Track, review, and manage your orders</p>
          </div>
        </div>

        <div className="space-y-6">
          {[...Array(3)].map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b pb-4">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-28" />
                    </div>
                    <div className="text-right">
                      <Skeleton className="mb-1 h-4 w-36" />
                      <Skeleton className="h-4 w-28" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-6 md:flex-row">
                    <Skeleton className="aspect-square w-40 rounded-lg" />
                    <div className="flex flex-1 flex-col justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-4">
                          <Skeleton className="h-6 w-40" />
                          <Skeleton className="h-6 w-24" />
                        </div>
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-48" />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Skeleton className="h-9 w-32" />
                        <Skeleton className="h-9 w-28" />
                        <Skeleton className="h-9 w-28" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
