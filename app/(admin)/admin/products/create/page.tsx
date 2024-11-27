import React from "react";
import CreateProductForm from "./components/CreateProductForm";
import {notFound} from "next/navigation";
import getSession from "@/lib/getSession";

const CreateProducts = async () => {
    const session = await getSession();
    if (session?.user.role !== "Admin" || !session) {
        notFound();
    }
    return (
        <div className="pt-[100px] container">
            <h1 className="font-semibold text-3xl">Create Product</h1>
            <CreateProductForm/>
        </div>
    );
};

export default CreateProducts;
