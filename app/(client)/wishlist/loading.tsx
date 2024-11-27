import Spinner from "@/components/loadingSpinner";
import React from "react";

const Loading = () => {
    return (
        <div className="pt-[40px] container">
            <div className="flex justify-between ">
                <h1 className="font-semibold text-3xl">Wishlist</h1>
            </div>
            <div className="absolute top-0 left-0 w-screen h-screen flex items-center justify-center">
                <Spinner size={60}/>
            </div>
        </div>
    );
};

export default Loading;
