"use client";

import { authClient } from "@/auth/auth-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import _ from "lodash";
import { ChevronsUpDown, Copy, MoreHorizontal, UserSearch } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || table.getIsSomePageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      const id = row.original.id as string;
      return (
        <div className={`px-4 font-medium`}>
          <Link href={`/admin/users/${id}`}>{name}</Link>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const email = row.getValue("email") as string;
      return <div className={`px-4 font-medium`}>{email}</div>;
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Role
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      return (
        <div className={`px-4 font-medium`}>
          {role === "user" ? (
            _.capitalize(role)
          ) : (
            <Badge variant={"destructive"}>{_.capitalize(role)}</Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "emailOffers",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email Offers
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const role: boolean = row.getValue("emailOffers");
      return (
        <div className={`px-4 font-medium`}>
          <Badge variant={role ? "secondary" : "destructive"}>
            {role ? "True" : "False"}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "storeCredit",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Credit
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const credit: number = row.getValue("storeCredit");
      return (
        <div className={`px-4 font-medium`}>
          <Badge variant={"outline"}>₹ {formatCurrency(credit)}</Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created At
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as Date;
      return <div className={`font-medium`}>{createdAt.toDateString()}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            }
          />
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(payment.id);
                  toast.success(`User ID copied to clipboard`);
                }}
              >
                <Copy />
                Copy ID
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  authClient.admin.impersonateUser({
                    userId: row.original.id,
                    fetchOptions: {
                      onSuccess: () => {
                        toast.success(`Impersonating ${row.original.email}`);
                        window.location.href = `${process.env.NEXT_PUBLIC_APP_URL}/account`;
                      },
                      onError: (ctx) => {
                        toast.error(ctx.error.message);
                      },
                    },
                  });
                }}
              >
                <UserSearch />
                Impersonate
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
