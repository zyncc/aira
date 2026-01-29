import SidebarInsetWrapper from "@/components/sidebar/sidebar-inset-wrapper";
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

export default async function CreateProduct() {
  return (
    <SidebarInsetWrapper title="Create Product">
      <div className="flex flex-1 flex-col gap-4 p-6">
        <CreateProductForm />
      </div>
    </SidebarInsetWrapper>
  );
}
