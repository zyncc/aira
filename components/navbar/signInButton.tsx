"use client"

import {SheetClose} from "@/components/ui/sheet";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import {usePathname} from "next/navigation";

export function SignInButtonMobile() {
    const pathname = usePathname()
    return (
        <Link href={`/signin?callbackUrl=${pathname}`}>
            <SheetClose>
                <Button variant={"secondary"}>Sign in</Button>
            </SheetClose>
        </Link>
    )
}

export function SignInButton() {
    const pathname = usePathname()
    return (
        <Link href={`/signin?callbackUrl=${pathname}`}>
            <Button
                variant={"secondary"}
                type="submit"
                className="hidden lg:block ml-3"
            >
                Sign in
            </Button>
        </Link>
    )
}