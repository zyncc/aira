"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProductsWithQuantity, Quantity } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import _ from "lodash";
import { ChevronsUpDown, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import EditQuantity from "./edit-quantity";

export const columns: ColumnDef<ProductsWithQuantity>[] = [
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
        <div className={`px-4 font-medium`}>
          <Link
            href={`${process.env.NEXT_PUBLIC_APP_URL}/${category.replaceAll(" ", "-")}/${id}`}
          >
            <Image
              src={images[0].replace(".jpg", ".jpg?tr=w-250")}
              alt="Product Image"
              priority
              className="aspect-square rounded-full object-cover object-top"
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
      return <div className={`px-4 font-medium whitespace-nowrap`}>{title}</div>;
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
      return <div className={`px-4 font-medium`}>{_.capitalize(category)}</div>;
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
      return <div className={`px-4 font-medium`}>Rs. {formatCurrency(price)}</div>;
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
        <div className={`px-4 font-medium whitespace-nowrap`}>
          {weight ? `${weight}g` : "NULL"}
        </div>
      );
    },
  },
  {
    accessorKey: "quantity",
    header: () => {
      return <div className="px-4 font-medium">Quantity</div>;
    },
    cell: ({ row }) => {
      const quantity: Quantity = row.getValue("quantity");
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
