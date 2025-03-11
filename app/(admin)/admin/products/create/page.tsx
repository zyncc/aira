import CreateProductForm from "@/components/CreateProductForm";
import SidebarInsetWrapper from "@/components/ui/sidebar-inset";
import React from "react";

const links = [
  {
    label: "Home",
    href: "/admin",
  },
  {
    label: "Products",
    href: "/admin/products",
  },
  {
    label: "Create",
    href: "/admin/products/create",
  },
];

export default function CreateProduct() {
  return (
    <div className="w-full">
      <SidebarInsetWrapper links={links} />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <CreateProductForm />
      </div>
    </div>
  );
}
