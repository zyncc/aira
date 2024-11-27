import {notFound} from "next/navigation";
import React from "react";
import UpdateProductForm from "./components/UpdateProductForm";
import prisma from "@/lib/prisma";
import getSession from "@/lib/getSession";

type Props = {
    params: {
        id: string;
    };
};

const CreateProducts = async ({params}: Props) => {
    const {id} = params;
    const session = await getSession();
    if (session?.user.role !== "Admin" || !session) {
        notFound();
    }
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
                <UpdateProductForm product={product}/>
            </div>
        );
    }
};

export default CreateProducts;
