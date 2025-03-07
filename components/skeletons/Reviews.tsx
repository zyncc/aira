import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function ReviewsSkeleton() {
  return (
    <div className="container mt-[80px]">
      <h1 className="font-semibold text-2xl mb-4">Reviews</h1>
      {[0, 1].map((iter, i) => (
        <Card
          key={i}
          className="w-full bg-background max-w-2xl mb-5 overflow-hidden"
        >
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-24" />
                </div>
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-4">
              <Skeleton className="aspect-square rounded-lg" />
              <Skeleton className="aspect-square rounded-lg" />
              <Skeleton className="aspect-square rounded-lg" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
