import SidebarInsetWrapper from "@/components/ui/sidebar-inset";

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
      <div className="space-y-5 px-4">
        <h1>Reviews</h1>
      </div>
    </div>
  );
}
