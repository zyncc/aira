import React from "react";
import AddReviewPage from "./addReviewPage";
import prisma from "@/lib/prisma";
import {redirect} from "next/navigation";
import getSession from "@/lib/getSession";

type Params = {
    params: {
        id: string;
    };
};

export default async function Page({params: {id}}: Params) {
    const session = await getSession();
    if (!session?.user) {
        redirect(`/signin?callbackUrl=/reviews/add/${id}`);
    }
    const product = await prisma.product.findUnique({
        where: {
            id,
        },
    });
    if (product)
        return (
            <section className="container mt-[40px]">
                <h1 className="text-2xl font-semibold">
                    Add a review for {product?.title}
                </h1>
                <AddReviewPage id={id} category={product?.category} session={session}/>
            </section>
        );
}
