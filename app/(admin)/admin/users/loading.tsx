import Spinner from "@/components/loadingSpinner";
import React from "react";

const Loading = () => {
    return (
        <section>
            <div className="pt-[40px]">
                <div className="flex justify-between w-screen container">
                    <h1 className="font-semibold text-3xl">All Users</h1>
                </div>
            </div>
            <div className="absolute top-0 left-0 w-screen h-screen flex items-center justify-center">
                <Spinner size={60}/>
            </div>
        </section>
    );
};

export default Loading;
