"use client";

import {ColumnDef} from "@tanstack/react-table";
import {ArrowUpDown} from "lucide-react";
import {Button} from "@/components/ui/button";
import Image from "next/image";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {archiveProduct, deleteProduct, unarchiveProduct,} from "@/actions/action";
import Link from "next/link";
import formatCurrency from "@/lib/formatCurrency";

type Product = {
    price?: number;
    id?: string;
    title?: string;
    image?: string[];
    quantity?: number;
    description?: string;
    category?: string;
    isArchived?: boolean;
    createdAt?: Date | null;
    updatedAt?: Date | null;
};

export const columns: ColumnDef<Product>[] = [
    {
        accessorKey: "images",
        header: () => <div className="text-left">Image</div>,
        cell: ({row}) => {
            const images = row.getValue("images") as string[];
            const id = row.original.id;
            return (
                <Link aria-label="navigation-link" href={`/admin/products/${id}`}>
                    <Image
                        src={images[0]}
                        width={45}
                        height={45}
                        className="rounded-full object-cover aspect-square"
                        alt="prodImg"
                        priority={true}
                    />
                </Link>
            );
        },
    },
    {
        accessorKey: "title",
        header: "Name",
        cell: ({row}) => {
            const id = row.original.id;
            const title = row.getValue("title") as string;
            return (
                <Link
                    aria-label="navigation-link"
                    href={`/admin/products/${id}`}
                    className="text-left"
                >
                    {title}
                </Link>
            );
        },
    },
    {
        accessorKey: "category",
        header: () => <div className="text-left">Category</div>,
        cell: ({row}) => {
            const category = row.getValue("category") as string;
            return (
                <p className="text-left">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                </p>
            );
        },
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({row}) => {
            const desc = row?.original?.description?.toString();
            return <div className="text-left font-medium line-clamp-2">{desc}</div>;
        },
    },
    {
        accessorKey: "price",
        header: () => <div className="text-left">Price</div>,
        cell: ({row}) => {
            const price = parseFloat(row.getValue("price"));
            const formatted = formatCurrency(price);

            return (
                <div className="text-left font-medium">{formatted.split(".")[0]}</div>
            );
        },
    },
    {
        accessorKey: "createdAt",
        header: ({column}) => {
            return (
                <Button
                    aria-label="Button"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    createdAt
                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                </Button>
            );
        },
        cell: ({row}) => {
            return row.original.createdAt?.toString().slice(0, 15);
        },
    },
    {
        accessorKey: "updatedAt",
        header: ({column}) => {
            return (
                <Button
                    aria-label="Button"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    updatedAt
                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                </Button>
            );
        },
        cell: ({row}) => {
            return row.original.updatedAt?.toString().slice(0, 15);
        },
    },
    {
        accessorKey: "Archive",
        header: () => <div className="text-left">Archived</div>,
        cell: ({row}) => {
            const id = row.original.id;
            const archived = row.original.isArchived;
            if (archived) {
                return (
                    <AlertDialog>
                        <AlertDialogTrigger className="font-bold text-white bg-slate-900 p-3 rounded-md">
                            UnArchive
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This product will be UnArchived and will be shown on the
                                    store.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => unarchiveProduct(id as string)}
                                >
                                    UnArchive
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                );
            } else {
                return (
                    <AlertDialog>
                        <AlertDialogTrigger className="font-bold text-white bg-slate-900 p-3 rounded-md">
                            Archive
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This product will be archived and will not be shown on the
                                    store anymore.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => archiveProduct(id as string)}>
                                    Archive
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                );
            }
        },
    },
    {
        accessorKey: "Delete",
        header: () => <div className="text-left">Delete</div>,
        cell: ({row}) => {
            const id = row.original.id;
            return (
                <AlertDialog>
                    <AlertDialogTrigger className="font-bold text-white bg-red-600 p-3 rounded-md">
                        Delete
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This product will permanently be
                                deleted from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteProduct(id as string)}>
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            );
        },
    },
];
