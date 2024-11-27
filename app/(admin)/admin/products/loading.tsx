import Spinner from "@/components/loadingSpinner";
import {Button} from "@/components/ui/button";
import React from "react";
import {FaPlus} from "react-icons/fa";

const Loading = () => {
    return (
        <>
            <div className="pt-[40px]">
                <div className="flex justify-between flex-wrap gap-5 w-screen container">
                    <h1 className="font-semibold text-3xl">All Products</h1>
                    <div className="flex gap-2">
                        <Button
                            aria-label="Button"
                            className="flex items-center justify-center font-bold"
                        >
                            <FaPlus size={20} className="mr-2"/>
                            Create
                        </Button>
                    </div>
                </div>
            </div>
            <div className="absolute top-0 left-0 w-screen h-screen flex items-center justify-center">
                <Spinner size={60}/>
            </div>
        </>
    );
};

export default Loading;
