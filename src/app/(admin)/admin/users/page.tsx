import SidebarInsetWrapper from "@/components/sidebar/sidebar-inset-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Suspense } from "react";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";

export default async function AdminUsersPage() {
  return (
    <SidebarInsetWrapper title="All Users">
      <div className="w-full flex-1 p-6">
        <Suspense fallback={<Loading />}>
          <UsersTable />
        </Suspense>
      </div>
    </SidebarInsetWrapper>
  );
}

async function UsersTable() {
  // await sleep(3);
  const data = await db.query.user.findMany({
    orderBy: (user, o) => o.desc(user.createdAt),
  });
  return <DataTable columns={columns} data={data} />;
}

function Loading() {
  return (
    <>
      <div className="flex items-center">
        <Input disabled placeholder="Filter by Email" className="max-w-sm" />
        <Button variant="outline" className="ml-auto" disabled>
          Columns
        </Button>
      </div>
      <div className="mt-3 overflow-x-scroll rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {["Name", "Email", "Phone", "Role", "Created At"].map((header, index) => (
                <TableHead key={index}>
                  <h3>{header}</h3>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 10 }).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {Array.from({ length: 5 }).map((_, cellIndex) => (
                  <TableCell key={cellIndex}>
                    <Skeleton className={`h-5 w-full rounded-[7px]`} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
