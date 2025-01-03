import prisma from "@/lib/prisma";
import React from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/auth";

export const revalidate = 3600;

const AllUsers = async () => {
  const session = await auth.api.getSession({
    headers: headers(),
  });
  if (session?.user.role !== "admin" || !session) {
    notFound();
  }
  const user = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  // await new Promise((resolve) =>
  //   setTimeout((resolve) => {
  //     resolve;
  //   }, 600)
  // );
  return (
    <section>
      <div className="pt-[100px]">
        <div className="flex justify-between w-screen container">
          <h1 className="font-semibold text-3xl">All Users</h1>
        </div>
      </div>
      <div className="container pt-5">
        <DataTable columns={columns} data={user} />
      </div>
    </section>
  );
};

export default AllUsers;
