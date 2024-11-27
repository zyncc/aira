import {Button} from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default function notFound() {
    return (
        <section className="flex gap-4 flex-col h-screen w-screen items-center justify-center">
            <h1 className="font-semibold text-xl">404 Not Found</h1>
            <Link href="/">
                <Button>Go back home</Button>
            </Link>
        </section>
    );
}
