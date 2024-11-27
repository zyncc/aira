import Spinner from "@/components/loadingSpinner";
import React from "react";

export default function loading() {
    return (
        <div className="pt-[40px] container">
            <h1 className="font-semibold text-3xl">Update Product</h1>
            <div className="absolute top-0 left-0 w-screen h-screen flex items-center justify-center">
                <Spinner size={60}/>
            </div>
        </div>
    );
}
