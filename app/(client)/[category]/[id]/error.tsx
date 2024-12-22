"use client"; // Error components must be Client Components

import {Button} from "@/components/ui/button";
import {useEffect} from "react";

export default function Error({
                                  error,
                                  reset,
                              }: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="section h-screen w-screen flex items-center justify-center gap-4 flex-col">
            <h2 className="font-medium text-2xl">Something went wrong!</h2>
            <Button variant={"secondary"} onClick={() => reset()}>
                Try again
            </Button>
        </div>
    );
}
