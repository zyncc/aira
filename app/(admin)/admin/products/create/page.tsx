import React from "react";
import CreateProductForm from "./components/CreateProductForm";
import {notFound} from "next/navigation";
import {headers} from "next/headers";
import {auth} from "@/auth";

const CreateProducts = async () => {
  const session = await auth.api.getSession({
    headers: headers(),
  });
  if (session?.user.role !== "admin" || !session) {
    notFound();
  }
  return (
    <div className="pt-[100px] container">
      <h1 className="font-semibold text-3xl">Create Product</h1>
      <CreateProductForm />
    </div>
  );
};

export default CreateProducts;
