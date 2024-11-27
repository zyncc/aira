import Spinner from "@/components/loadingSpinner";
import React from "react";

const Loading = () => {
    return (
        <div className="absolute top-0 left-0 w-screen h-screen flex items-center justify-center">
            <Spinner size={60}/>
        </div>
    );
};

export default Loading;
