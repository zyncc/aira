import {auth} from "@/auth";
import {headers} from "next/headers";
import {notFound} from "next/navigation";
import React from "react";

export default async function AdminPage() {
  const session = await auth.api.getSession({
    headers: headers(),
  });
  if (session?.user.role !== "admin") {
    return notFound();
  }
  return <div className="mt-[100px] container">AdminPage</div>;
}
