import { auth } from "@/auth";
import SidebarInsetWrapper from "@/components/ui/sidebar-inset";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import prisma from "@/lib/prisma";
import { columns } from "@/components/admin-tables/all-products/columns";
import { DataTable } from "@/components/admin-tables/all-products/data-table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Plus,
} from "lucide-react";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";

const links = [
  {
    label: "Home",
    href: "/admin",
  },
  {
    label: "Products",
    href: "/admin/products",
  },
];

export default async function AdminProductsPage() {
  const session = await auth.api.getSession({
    headers: headers(),
  });
  if (session?.user.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="w-full overflow-hidden">
      <SidebarInsetWrapper links={links} />
      <div className="p-4 pt-0 flex-1 w-full">
        <Suspense fallback={<Loading />}>
          <ProductsTable />
        </Suspense>
      </div>
    </div>
  );
}

async function ProductsTable() {
  // await new Promise<void>((resolve) =>
  //   setTimeout(() => {
  //     resolve();
  //   }, 300000000)
  // );
  const data = await prisma.product.findMany({
    include: {
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
            <Plus size={32} className="h-4 w-4 mr-2" />
            Create
          </Button>
          <Button variant="outline" className="ml-auto" disabled>
            Columns
          </Button>
        </div>
      </div>
      <div className="rounded-md border overflow-x-scroll">
        <Table>
          <TableHeader>
            <TableRow>
              {[
                "Image",
                "Title",
                "Category",
                "Price",
                "Weight",
                "Created At",
              ].map((header, index) => (
                <TableHead key={index}>
                  <h3>{header}</h3>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 10 }).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {Array.from({ length: 6 }).map((_, cellIndex) => (
                  <TableCell key={cellIndex}>
                    <Skeleton className={`h-6 rounded-[7px] w-full`} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between px-2 mt-3">
        <div className="flex-1 text-sm text-muted-foreground">
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
            <Button
              disabled
              variant="outline"
              className="rounded-[10px] h-8 w-8 p-0"
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft />
            </Button>
            <Button
              disabled
              variant="outline"
              className="h-8 w-8 p-0 rounded-[10px]"
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft />
            </Button>
            <Button
              disabled
              variant="outline"
              className="h-8 w-8 p-0 rounded-[10px]"
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight />
            </Button>
            <Button
              disabled
              variant="outline"
              className="h-8 w-8 p-0 rounded-[10px]"
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
