import { columns } from "@/components/admin-tables/all-users/columns";
import { DataTable } from "@/components/admin-tables/all-users/data-table";
import SidebarInsetWrapper from "@/components/ui/sidebar-inset";
import { Suspense } from "react";
import prisma from "@/lib/prisma";
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
} from "lucide-react";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";

const links = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Users",
    href: "/admin/users",
  },
];

export const revalidate = 60;

export default async function AdminUsersPage() {
  return (
    <div className="w-full overflow-hidden">
      <SidebarInsetWrapper links={links} />
      <div className="w-full p-4 pt-0  flex-1">
        <Suspense fallback={<Loading />}>
          <UsersTable />
        </Suspense>
      </div>
    </div>
  );
}

async function UsersTable() {
  // await new Promise<void>((resolve) =>
  //   setTimeout(() => {
  //     resolve();
  //   }, 1000)
  // );
  const data = await prisma.user.findMany();
  return <DataTable columns={columns} data={data} />;
}

function Loading() {
  return (
    <div>
      <div className="flex items-center py-4">
        <Input disabled placeholder="Filter by Email" className="max-w-sm" />
        <Button variant="outline" className="ml-auto" disabled>
          Columns
        </Button>
      </div>
      <div className="rounded-md border overflow-x-scroll">
        <Table>
          <TableHeader>
            <TableRow>
              {["Name", "Email", "Phone", "Role", "Created At"].map(
                (header, index) => (
                  <TableHead key={index}>
                    <h3>{header}</h3>
                  </TableHead>
                )
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 10 }).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {Array.from({ length: 5 }).map((_, cellIndex) => (
                  <TableCell key={cellIndex}>
                    <Skeleton className={`h-5 rounded-[7px] w-full`} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between px-2 mt-3">
        <div className="flex-1 text-sm text-muted-foreground-foreground">
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
