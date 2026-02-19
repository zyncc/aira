"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ApproveOrder, DeleteOrder } from "@/functions/admin/cod";
import { Address, FullOrderType } from "@/lib/types";
import { formatCurrency, formatSize } from "@/lib/utils";
import { IconDotsVertical } from "@tabler/icons-react";
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type Row,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import Link from "next/link";
import * as React from "react";
import { toast } from "sonner";
import AddressSheet from "../../orders/_components/address-sheet";

type Data = FullOrderType;

const columns: ColumnDef<Data>[] = [
  {
    accessorKey: "Order Id",
    header: "Order Id",
    cell: ({ row }) => <h1>{row.original.id}</h1>,
  },
  {
    accessorKey: "Customer",
    header: "Customer",
    cell: ({ row }) => (
      <Link
        href={`/admin/users/${row.original.userId}`}
        className="hover:text-destructive hover:underline"
      >
        {row.original.user.name}
      </Link>
    ),
  },
  {
    accessorKey: "product",
    header: "Product",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        {row.original.items.map((item) => (
          <span key={item.id} className="my-2 whitespace-nowrap">
            {item.product.title}
          </span>
        ))}
      </div>
    ),
  },
  {
    accessorKey: "order Size",
    header: "Size",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        {row.original.items.map((item) => (
          <Badge key={item.id} variant={"secondary"} className="my-2 w-fit">
            {formatSize(item.size)}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    accessorKey: "Quantity",
    header: "Quantity",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        {row.original.items.map((item) => (
          <span key={item.id} className="my-2 text-center font-medium">
            {item.quantity}
          </span>
        ))}
      </div>
    ),
  },
  {
    accessorKey: "Shipment Cost",
    header: "Shipment Cost",
    cell: ({ row }) => {
      return <div>₹{formatCurrency(row.original.shippingPrice)}</div>;
    },
  },
  {
    accessorKey: "Order Price",
    header: "Order Price",
    cell: ({ row }) => {
      return <div>₹{formatCurrency(row.original.totalPrice)}</div>;
    },
  },
  {
    accessorKey: "Order Date",
    header: "Order Date",
    cell: ({ row }) => (
      <div>
        {row.original.createdAt.toLocaleDateString("en-GB", {
          month: "short",
          day: "numeric",
          year: "numeric",
          timeZone: "Asia/Kolkata",
        })}
      </div>
    ),
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
    id: "actions",
    cell: ({ row }) => {
      const order = row.original;
      return <ApproveDialog order={order} />;
    },
  },
];

function ApproveDialog({ order }: { order: FullOrderType }) {
  const [approveDialogOpen, setApproveDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
              size="icon"
            >
              <IconDotsVertical />
              <span className="sr-only">Open menu</span>
            </Button>
          }
        ></DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem onClick={() => setApproveDialogOpen(true)}>
            Approve
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setDeleteDialogOpen(true)}
            variant="destructive"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you absolutely sure you want to approve <b>{order.firstName}&apos;s</b>{" "}
              order?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will approve the order and create a shipment for it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={loading}
              onClick={async () => {
                setLoading(true);
                const res = await ApproveOrder(order);
                if (!res.success) {
                  setApproveDialogOpen(false);
                  toast.error(res.message);
                  setLoading(false);
                  return;
                }
                toast.success(res.message);
                setApproveDialogOpen(false);
                setLoading(false);
              }}
            >
              {loading && <Spinner />} Approve
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you absolutely sure you want to delete <b>{order.firstName}&apos;s</b>{" "}
              order?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will delete the order and it cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={loading}
              onClick={async () => {
                setLoading(true);
                const res = await DeleteOrder(order.id);
                if (!res.success) {
                  setDeleteDialogOpen(false);
                  toast.error(res.message);
                  setLoading(false);
                  return;
                }
                toast.success(res.message);
                setDeleteDialogOpen(false);
                setLoading(false);
              }}
            >
              {loading && <Spinner />} Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function Row({ row }: { row: Row<Data> }) {
  return (
    <TableRow>
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

export function DataTable({ data: initialData }: { data: Data[] }) {
  const [data, setData] = React.useState(() => initialData);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
    },
    getRowId: (row) => row.id.toString(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div>
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="**:data-[slot=table-cell]:first:w-8">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => <Row key={row.id} row={row} />)
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
    </div>
  );
}
