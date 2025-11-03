import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle } from "lucide-react";

export default function AddressesLoading() {
  return (
    <Container className="mt-[30px] space-y-8 px-2 py-8">
      <div className="flex items-center justify-between gap-x-4">
        <div>
          <h1 className="text-2xl font-semibold">Addresses</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage your shipping addresses
          </p>
        </div>
        <Button className="mt-6 gap-2" disabled>
          <PlusCircle className="h-4 w-4" />
          Add address
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-1 items-start gap-4 rounded-lg border p-4">
            {/* Icon placeholder */}
            <Skeleton className="hidden h-10 w-10 flex-shrink-0 rounded-full sm:block" />

            {/* Address details placeholder */}
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-28" />
            </div>

            {/* Edit button placeholder */}
            <Skeleton className="h-10 w-10 rounded-md" />
          </div>
        ))}
      </div>
    </Container>
  );
}
