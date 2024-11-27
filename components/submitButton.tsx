"use client"

import {useFormStatus} from "react-dom";
import {Button} from "@/components/ui/button";
import React from "react";
import Spinner from "@/components/loadingSpinner";

export function SubmitPayButton() {
    const { pending } = useFormStatus();
    return (
        <Button
            className={`w-full`}
            variant={"secondary"}
            type="submit"
            disabled={pending}
        >
            {pending ? <Spinner size={30} /> : `Proceed to Pay`}
        </Button>
    )
}