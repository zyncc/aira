import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ReviewsSkeleton() {
  return (
    <Container className="mt-10">
      <h1 className="mb-4 text-2xl font-semibold">Customer Reviews</h1>
      {[0, 1].map((iter, i) => (
        <Card key={i} className="bg-background mb-5 w-full max-w-2xl overflow-hidden">
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
    </Container>
  );
}

export function QuantityLoader() {
  return (
    <div className="flex flex-col">
      <div className="space-y-3">
        <div className="flex flex-wrap gap-3">
          {[
            { key: "sm", label: "S", qty: 10 },
            { key: "md", label: "M", qty: 10 },
            { key: "lg", label: "L", qty: 10 },
            { key: "xl", label: "XL", qty: 10 },
            { key: "doublexl", label: "2XL", qty: 10 },
          ].map((sizeOption) => (
            <div key={sizeOption.key} className="flex flex-col items-center gap-1">
              <Button
                type="button"
                disabled
                className={"h-12 w-12 rounded-full font-medium transition-all"}
                variant="outline"
              >
                {sizeOption.label}
              </Button>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-5 flex flex-col gap-3">
        <Button className="py-6 font-medium" disabled>
          Add to Cart
        </Button>
        <Button className="py-6 font-medium" variant={"secondary"} disabled>
          Buy now
        </Button>
      </div>
    </div>
  );
}
