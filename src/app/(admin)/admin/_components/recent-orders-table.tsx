"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Address, OrderWithUser } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { Copy, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import AddressSheet from "../orders/_components/address-sheet";

const columns: ColumnDef<OrderWithUser>[] = [
  {
    accessorKey: "id",
    header: "Order ID",
    cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "user",
    header: "Customer",
    cell: ({ row }) => {
      const user = row.getValue("user") as { name: string };
      return <div className="font-medium">{user.name}</div>;
    },
  },
  {
    accessorKey: "waybill",
    header: "AWB Number",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("waybill") ?? "GDHASIWNGSOWOT"}</div>
    ),
  },
  {
    accessorKey: "paymentId",
    header: () => <div className="text-left">Payment ID</div>,
    cell: ({ row }) => {
      const paymentId = row.getValue("paymentId") as string;
      return <div className="text-left font-medium">{paymentId}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Order Date",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date;
      return (
        <div className="text-left font-medium">
          {date.toLocaleDateString("en-GB", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: () => <div className="text-left">Amount</div>,
    cell: ({ row }) => (
      <div className="text-left font-medium">
        Rs. {formatCurrency(row.getValue("price"))}
      </div>
    ),
  },
  {
    accessorKey: "ttd",
    header: () => <div className="text-left">TTD</div>,
    cell: ({ row }) => {
      const ttd = row.getValue("ttd") as Date;
      return (
        <div className="text-left font-medium">
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
    header: () => <div className="text-left">Pickup Date</div>,
    cell: ({ row }) => {
      const pickupDate = row.getValue("pickupDate") as string;
      return <div className="text-left font-medium">{pickupDate ?? "28th July"}</div>;
    },
  },
  {
    accessorKey: "shipmentCost",
    header: () => <div className="text-left">Shipment Cost</div>,
    cell: ({ row }) => {
      const shipmentCost = row.getValue("shipmentCost") as number;
      return (
        <div className="text-left font-medium">Rs. {formatCurrency(shipmentCost)}</div>
      );
    },
  },
  {
    accessorKey: "address",
    header: () => <div className="text-center">Address</div>,
    cell: ({ row }) => {
      const address: Address = row.getValue("address");
      return <AddressSheet address={address} />;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="text-left">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(row.original.id);
                toast.success("Order ID copied to clipboard");
              }}
            >
              <Copy className="mr-1 h-4 w-4" /> Order ID
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];

export default function RecentOrdersTable({ orders }: { orders: OrderWithUser[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const table = useReactTable({
    data: orders,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  return (
    <div className="mt-10">
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
          <TableBody className="whitespace-nowrap">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          Showing{" "}
          {table.getState().pagination.pageIndex * table.getState().pagination.pageSize +
            1}
          -
          {Math.min(
            (table.getState().pagination.pageIndex + 1) *
              table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length,
          )}{" "}
          of {table.getFilteredRowModel().rows.length} orders
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
