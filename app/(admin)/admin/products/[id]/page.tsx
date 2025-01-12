import { notFound } from "next/navigation";
import React from "react";
import UpdateProductForm from "./components/UpdateProductForm";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { auth } from "@/auth";

type Props = {
  params: {
    id: string;
  };
};

const CreateProducts = async ({ params }: Props) => {
  const { id } = params;
  const product = await prisma.product.findUnique({
    where: {
      id,
    },
    include: {
      quantity: true,
    },
  });

  if (!product?.title) {
    return notFound();
  } else {
    return (
      <div className="pt-[100px] container">
        <h1 className="font-semibold text-3xl">Update Product</h1>
        <UpdateProductForm product={product} />
      </div>
    );
  }
};

export default CreateProducts;
