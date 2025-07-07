import SidebarInsetWrapper from "@/components/ui/sidebar-inset";
import prisma from "@/lib/prisma";
import React from "react";
import { InventoryClient } from "./_client";

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
    label: "Inventory",
    href: "/admin/products/inventory",
  },
];

export default async function InventoryPage() {
  const productsWithQuantity = await prisma.product.findMany({
    include: {
      quantity: true,
    },
  });
  return (
    <div className="w-full overflow-hidden">
      <SidebarInsetWrapper links={links} />
      <div className="px-4 space-y-5">
        <InventoryClient productsWithQuantity={productsWithQuantity} />
      </div>
    </div>
  );
}
