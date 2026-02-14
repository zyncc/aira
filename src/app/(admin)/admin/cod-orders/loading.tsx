import SidebarInsetWrapper from "@/components/sidebar/sidebar-inset-wrapper";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function OrdersLoading() {
  return (
    <SidebarInsetWrapper title="COD Orders">
      <div className="space-y-5 p-6">
        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Skeleton className="h-5 w-16" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-5 w-20" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-5 w-24" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-5 w-20" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-5 w-20" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-5 w-16" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-8 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-28" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-16" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </SidebarInsetWrapper>
  );
}
