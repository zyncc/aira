import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import SidebarInsetWrapper from "@/components/ui/sidebar-inset";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/db/instance";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Plus,
} from "lucide-react";
import { Suspense } from "react";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";

const links = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Products",
    href: "/admin/products",
  },
];

export default async function AdminProductsPage() {
  return (
    <div className="w-full overflow-hidden">
      <SidebarInsetWrapper links={links} />
      <div className="w-full flex-1 p-4 pt-0">
        <Suspense fallback={<Loading />}>
          <ProductsTable />
        </Suspense>
      </div>
    </div>
  );
}

async function ProductsTable() {
  // await sleep(3)
  const data = await db.query.product.findMany({
    with: {
      quantity: true,
    },
  });
  return <DataTable columns={columns} data={data} />;
}

function Loading() {
  return (
    <div>
      <div className="flex items-center justify-between py-4">
        <Input disabled placeholder="Filter by Title" className="max-w-sm" />
        <div className="flex gap-x-3">
          <Button variant="outline" className="ml-auto" disabled>
            <Plus size={32} className="mr-2 h-4 w-4" />
            Create
          </Button>
          <Button variant="outline" className="ml-auto" disabled>
            Columns
          </Button>
        </div>
      </div>
      <div className="overflow-x-scroll rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {["Image", "Title", "Category", "Price", "Weight", "Created At"].map(
                (header, index) => (
                  <TableHead key={index}>
                    <h3>{header}</h3>
                  </TableHead>
                ),
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 10 }).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {Array.from({ length: 6 }).map((_, cellIndex) => (
                  <TableCell key={cellIndex}>
                    <Skeleton className={`h-5 w-full rounded-[7px]`} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="mt-3 flex items-center justify-between px-2">
        <div className="text-muted-foreground-foreground-foreground-foreground-foreground-foreground-foreground flex-1 text-sm">
          0 of 10 row(s) selected.
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select disabled>
              <SelectTrigger className="h-8 w-[70px] rounded-[10px]">
                <SelectValue placeholder={10} />
              </SelectTrigger>
            </Select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page 1 of 10
          </div>
          <div className="flex items-center space-x-2">
            <Button disabled variant="outline" className="h-8 w-8 rounded-[10px] p-0">
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft />
            </Button>
            <Button disabled variant="outline" className="h-8 w-8 rounded-[10px] p-0">
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft />
            </Button>
            <Button disabled variant="outline" className="h-8 w-8 rounded-[10px] p-0">
              <span className="sr-only">Go to next page</span>
              <ChevronRight />
            </Button>
            <Button disabled variant="outline" className="h-8 w-8 rounded-[10px] p-0">
              <span className="sr-only">Go to last page</span>
              <ChevronsRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
