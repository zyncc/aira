"use client"; // Error components must be Client Components

import {Button} from "@/components/ui/button";
import Link from "next/link";
import {useEffect} from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="section container text-center h-screen w-screen flex items-center justify-center gap-4 flex-col">
      <h2 className="font-medium text-2xl ">{error.message}</h2>
      <div className="flex gap-3">
        <Link href={"/"}>
          <Button variant={"secondary"}>Go to Home</Button>
        </Link>
        <Button variant={"secondary"} onClick={() => reset()}>
          Try again
        </Button>
      </div>
    </div>
  );
}
