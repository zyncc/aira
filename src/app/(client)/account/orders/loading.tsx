import { Container } from "@/components/container";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function OrdersLoading() {
  return (
    <Container className="px-2 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Orders</h1>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="px-4 sm:px-6">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                    <div>
                      <Skeleton className="mb-2 h-5 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="flex flex-col items-start md:items-end">
                      <Skeleton className="mb-2 h-4 w-20" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                  </div>
                  <div className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </div>
                    <div className="flex flex-col items-start gap-y-2 md:items-end">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <Skeleton className="mb-3 h-4 w-20" />
                    <div className="flex items-center justify-between gap-4">
                      <Skeleton className="h-20 w-20 shrink-0 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-1/5" />
                        <Skeleton className="h-4 w-1/4" />
                        <div className="space-y-1 pt-2">
                          <Skeleton className="h-3 w-16" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </div>
                      <Skeleton className="h-9 w-24 shrink-0" />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Container>
  );
}
