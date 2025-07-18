"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ChevronsUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import Image from "next/image";
import { capitalizeFirstLetter } from "@/lib/caplitaliseFirstLetter";
import formatCurrency from "@/lib/formatCurrency";
import { ProductsWithQuantity } from "@/lib/types";
import { quantity } from "@prisma/client";
import EditQuantity from "./editQuantity";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<ProductsWithQuantity>[] = [
  // {
  //     id: "select",
  //     header: ({table}) => (
  //         <div className="flex items-center justify-center">
  //             <Checkbox
  //                 checked={
  //                     table.getIsAllPageRowsSelected() ||
  //                     (table.getIsSomePageRowsSelected() && "indeterminate")
  //                 }
  //                 onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //                 aria-label="Select all"
  //             />
  //         </div>
  //     ),
  //     cell: ({row}) => (
  //         <div className="flex items-center justify-center">
  //             <Checkbox
  //                 checked={row.getIsSelected()}
  //                 onCheckedChange={(value) => row.toggleSelected(!!value)}
  //                 aria-label="Select row"
  //             />
  //         </div>
  //     ),
  //     enableSorting: true,
  //     enableHiding: true,
  // },
  {
    accessorKey: "images",
    header: () => {
      return <Button variant="ghost">Image</Button>;
    },
    cell: ({ row }) => {
      const images = row.getValue("images") as string[];
      const { id } = row.original;
      const category = row.getValue("category") as string;
      return (
        <div className={`font-medium px-4`}>
          <Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/${category.replaceAll(" ", "-")}/${id}`}>
            <Image
              src={images[0]}
              alt="Product Image"
              priority
              className="object-cover rounded-full aspect-square object-top"
              width={40}
              height={40}
            />
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const title = row.getValue("title") as string;
      return (
        <div className={`font-medium px-4 whitespace-nowrap`}>{title}</div>
      );
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const category = row.getValue("category") as string;
      return (
        <div className={`font-medium px-4`}>
          {capitalizeFirstLetter(category)}
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const price = row.getValue("price") as number;
      return (
        <div className={`font-medium px-4`}>Rs. {formatCurrency(price)}</div>
      );
    },
  },
  {
    accessorKey: "weight",
    header: () => {
      return <div className="font-medium">Weight</div>;
    },
    cell: ({ row }) => {
      const weight = row.getValue("weight") as number;
      return (
        <div className={`font-medium px-4 whitespace-nowrap`}>
          {weight ? `${weight}g` : "NULL"}
        </div>
      );
    },
  },
  {
    accessorKey: "quantity",
    header: () => {
      return <div className="font-medium px-4">Quantity</div>;
    },
    cell: ({ row }) => {
      const quantity = row.getValue("quantity") as quantity;
      return <EditQuantity quantity={quantity} />;
    },
  },
  {
    accessorKey: "isArchived",
    header: "Archived",
    cell: ({ row }) => {
      const isArchived = row.getValue("isArchived") as boolean;
      return (
        <Badge
          className={`font-medium whitespace-nowrap`}
          variant={isArchived ? "destructive" : "outline"}
        >
          {isArchived ? "True" : "False"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
    cell: ({ row }) => {
      const isArchived = row.getValue("isFeatured") as boolean;
      return (
        <Badge
          className={`font-medium whitespace-nowrap`}
          variant={isArchived ? "default" : "outline"}
        >
          {isArchived ? "True" : "False"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(payment.id);
                toast.success(`Product ID copied to clipboard`);
              }}
            >
              Copy ID
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
