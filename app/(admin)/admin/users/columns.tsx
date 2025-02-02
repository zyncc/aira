"use client";

import {ColumnDef} from "@tanstack/react-table";
import {ArrowUpDown, Copy, MoreHorizontal, UserCog} from "lucide-react";
import {Button} from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {admin} from "@/lib/authClient";

export type Users = {
  id?: string | null;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  role?: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
};

export const columns: ColumnDef<Users>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          aria-label="Button"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          aria-label="Button"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => {
      if (row.original.phone) {
        return row.original.phone;
      } else {
        return "None";
      }
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => {
      return (
        <Button
          aria-label="Button"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Role
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          aria-label="Button"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          createdAt
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return row.original.createdAt?.toString().slice(0, 15);
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-label="Button" variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              className="flex gap-x-2"
              onClick={() =>
                navigator.clipboard.writeText(row.original.id as string)
              }
            >
              <Copy size={20} />
              Copy UID
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={async () => {
                const uid: string = row.original.id as string;
                await admin.impersonateUser({
                  userId: uid,
                  fetchOptions: {
                    onError(context) {
                      console.error(context.error);
                    },
                    onSuccess: () => {
                      window.location.href = "/account";
                    },
                  },
                });
              }}
              className="flex gap-x-2"
            >
              <UserCog />
              Impersonate
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
