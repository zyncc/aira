import React from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { FaPlus } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import prisma from "@/lib/prisma";

const Products = async () => {
  const data = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <>
      <div className="pt-5 container">
        <div className="flex p-0 justify-between container">
          <h1 className="font-semibold text-3xl">All Products</h1>
          <div className="flex gap-2">
            <Link aria-label="navigation-link" href={"/admin/products/create"}>
              <Button className="flex items-center justify-center font-bold">
                <FaPlus size={20} className="mr-2" />
                Create
              </Button>
            </Link>
          </div>
        </div>
        <div className="pt-2">
          <DataTable columns={columns} data={data} />
        </div>
      </div>
    </>
  );
};

export default Products;
