import React from "react";
import InfiniteLoader from "../infiniteLoader";

export const revalidate = 0;

export default async function Page() {
  return (
    <div className="container">
      <h1 className="mt-10 font-semibold text-2xl">Your Orders</h1>
      <div className="flex items-center flex-col">
        <div className="mt-10 w-full">
          <InfiniteLoader />
        </div>
      </div>
    </div>
  );
}
