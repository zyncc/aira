import prisma from "@/lib/prisma";
import React from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";

const AllUsers = async () => {
  // const user = await prisma.user.findMany({
  //   orderBy: {
  //     createdAt: "desc",
  //   },
  // });
  // await new Promise((resolve) =>
  //   setTimeout((resolve) => {
  //     resolve;
  //   }, 600)
  // );
  return (
    <section className="flex justify-center w-full">
      <div className="pt-5 container">
        <div className="flex p-0 justify-between container">
          <h1 className="font-semibold text-3xl">All Users</h1>
        </div>
        <div className="pt-2 w-full">
          {/* <DataTable columns={columns} data={user} /> */}
        </div>
      </div>
    </section>
  );
};

export default AllUsers;
