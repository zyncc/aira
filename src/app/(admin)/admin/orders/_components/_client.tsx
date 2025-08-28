"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Columns3, IndianRupee, Truck } from "lucide-react";
import { useState } from "react";

export default function OrdersPageClient({ allOrders }: { allOrders: FullOrderType[] }) {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    initialData: {
      pages: [
        {
          orders: allOrders,
          nextCursor: allOrders.length === 11 ? allOrders[allOrders.length - 1].id : null,
        },
      ],
      pageParams: [undefined],
    },
    queryKey: ["admin-all-orders"],
    queryFn: async ({ pageParam }) => {
      const res = await fetch(
        `/api/infiniteQuery/adminOrders${pageParam ? `?cursor=${pageParam}` : ""}`,
      );
      return await res.json();
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined,
    staleTime: Infinity,
    refetchInterval: false,
  });

  const infiniteOrders: FullOrderType[] =
    data?.pages.flatMap((page) => page.orders) || [];

  return (
    <div className="space-y-5 px-4">
      <div className="rounded-md">
        <DataTable
          columns={columns}
          data={infiniteOrders}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
          itemsPerPage={11}
        />
      </div>
    </div>
  );
}

const columns: ColumnDef<FullOrderType>[] = [
  {
    accessorKey: "user",
    header: "Customer",
    cell: ({ row }) => {
      const user = row.original.user;
      return (
        <div>
          <div className="font-medium">{user.name}</div>
          <div className="text-muted-foreground text-sm">{user.email}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "waybill",
    header: "AWB",
  },
  {
    accessorKey: "createdAt",
    header: "Order Date",
    cell({ row }) {
      const createdAt = row.original.createdAt;
      return format(createdAt, "PPP");
    },
  },
  {
    accessorKey: "ttd",
    header: "TTD",
    cell: ({ row }) => {
      const ttd = row.getValue("ttd") as Date;
      return (
        <div className="text-left">
          {ttd?.toLocaleDateString("en-GB", {
            month: "short",
            day: "numeric",
            year: "numeric",
            timeZone: "Asia/Kolkata",
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "pickupDate",
    header: "pickup Date",
    cell: ({ row }) => {
      const pickupDate = row.getValue("pickupDate") as string;
      return <div className="text-left">{pickupDate ?? "28th July"}</div>;
    },
  },
  {
    accessorKey: "shipmentCost",
    header: "Shipment Cost",
    cell: ({ row }) => {
      const shipmentCost = row.getValue("shipmentCost") as number;
      return <div className="text-left">Rs. {formatCurrency(shipmentCost)}</div>;
    },
  },
  {
    accessorKey: "product.title",
    header: "Product",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = row.original.price;
      return `₹${formatCurrency(price)}`;
    },
  },
  {
    accessorKey: "paymentSuccess",
    header: "Payment",
    cell: ({ row }) => {
      const paymentSuccess = row.original.paymentSuccess;
      return (
        <Badge variant={paymentSuccess ? "default" : "destructive"}>
          {paymentSuccess ? "Paid" : "Unpaid"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "address1",
    header: () => <div className="text-center">Address</div>,
    cell: ({ row }) => {
      const original = row.original;
      const address: Omit<Address, "userId" | "id" | "createdAt" | "updatedAt"> = {
        firstName: original.firstName,
        lastName: original.lastName ?? "",
        email: original.email,
        phone: original.phone,
        address1: original.address1,
        address2: original.address2 ?? "",
        city: original.city,
        state: original.state,
        zipcode: original.zipcode,
      };

      return <AddressSheet address={address} />;
    },
  },
  {
    accessorKey: "id",
    header: "Order ID",
  },
];

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  hasNextPage?: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  itemsPerPage: number;
}

import { Address, FullOrderType } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  type ColumnFiltersState,
  type VisibilityState,
} from "@tanstack/react-table";
import { Loader2 } from "lucide-react";
import AddressSheet from "./address-sheet";

export function DataTable<TData, TValue>({
  columns,
  data,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
  itemsPerPage,
}: DataTableProps<TData, TValue>) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState("all");
  const [status, setStatus] = useState("all");

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const currentPageData = data.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage,
  );

  const table = useReactTable({
    data: currentPageData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnVisibility,
      columnFilters,
    },
    manualPagination: true,
  });

  const handleNextPage = () => {
    const nextPageIndex = currentPage + 1;
    const nextPageStartIndex = nextPageIndex * itemsPerPage;

    if (nextPageStartIndex >= data.length && hasNextPage) {
      fetchNextPage();
    }

    setCurrentPage(nextPageIndex);
  };

  const handlePreviousPage = () => {
    setCurrentPage(Math.max(0, currentPage - 1));
  };

  const canGoNext = () => {
    const nextPageStartIndex = (currentPage + 1) * itemsPerPage;
    return nextPageStartIndex < data.length || hasNextPage;
  };

  const canGoPrevious = () => {
    return currentPage > 0;
  };

  return (
    <>
      <div className="flex items-center justify-between space-x-2 py-4">
        <Input
          placeholder="Filter by ID"
          defaultValue={table.getColumn("id")?.getFilterValue() as string}
          onChange={(event) => table.getColumn("id")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <div className="flex space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Truck />
                <span className="hidden lg:block">Status</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuRadioGroup value={status} onValueChange={setStatus}>
                <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="pending">Pending</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="processing">
                  Processing
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="shipped">Shipped</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="delivered">Delivered</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="cancelled">Cancelled</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <IndianRupee />
                <span className="hidden lg:block">Payment</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuRadioGroup
                value={paymentStatus}
                onValueChange={setPaymentStatus}
              >
                <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="paid">Paid</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="unpaid">Unpaid</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto bg-transparent">
                <Columns3 />
                <span className="hidden lg:block">Columns</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              <>
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
                {/* Loading row when fetching next page */}
                {isFetchingNextPage && (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Loading more orders...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {isFetchingNextPage ? (
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Loading...</span>
                    </div>
                  ) : (
                    "No results."
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between py-4">
        <div className="text-sm font-medium">
          Page {currentPage + 1} of {Math.max(1, totalPages)}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={!canGoPrevious()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={!canGoNext() || isFetchingNextPage}
          >
            {isFetchingNextPage ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Next"
            )}
          </Button>
        </div>
      </div>
    </>
  );
}
