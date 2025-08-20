import SidebarInsetWrapper from "@/components/ui/sidebar-inset";
import CreateProductForm from "./_components/CreateProductForm";

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
    label: "Create",
    href: "/admin/products/create",
  },
];

export const revalidate = 60;

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
