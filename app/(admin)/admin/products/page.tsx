import React from "react";
import {DataTable} from "./data-table";
import {columns} from "./columns";
import {FaPlus} from "react-icons/fa6";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import prisma from "@/lib/prisma";
import {notFound} from "next/navigation";
import getSession from "@/lib/getSession";

export const revalidate = 600;

const Products = async () => {
    const session = await getSession();
    if (session?.user.role !== "Admin" || !session) {
        notFound();
    }
    const data = await prisma.product.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
    // await new Promise((resolve) =>
    //   setTimeout((resolve) => {
    //     resolve;
    //   }, 600)
    // );
    return (
        <>
            <div className="pt-[100px]">
                <div className="flex justify-between flex-wrap gap-5 w-screen container">
                    <h1 className="font-semibold text-3xl">All Products</h1>
                    <div className="flex gap-2">
                        <Link aria-label="navigation-link" href={"/admin/products/create"}>
                            <Button
                                aria-label="Button"
                                className="flex items-center justify-center font-bold"
                            >
                                <FaPlus size={20} className="mr-2"/>
                                Create
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="container pt-2">
                <DataTable columns={columns} data={data}/>
            </div>
        </>
    );
};

export default Products;
