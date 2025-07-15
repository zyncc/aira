import SidebarInsetWrapper from "@/components/ui/sidebar-inset";
import React from "react";

const links = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Products",
    href: "/admin/products",
  },
  {
    label: "Reviews",
    href: "/admin/products/reviews",
  },
];

export const revalidate = 60;

export default function ReviewsPage() {
  return (
    <div className="w-full overflow-hidden">
      <SidebarInsetWrapper links={links} />
      <div className="px-4 space-y-5">
        <h1>Reviews</h1>
      </div>
    </div>
  );
}
