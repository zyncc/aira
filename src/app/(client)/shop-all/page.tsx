import { db } from "@/db/instance";
import { Metadata } from "next";
import ProductGrid from "./ProductGrid";
import { cacheLife } from "next/cache";

export const metadata: Metadata = {
  title: "Shop All",
  description: "Affordable Summer Clothing made from 100% Linen Fabric",
};

export default async function Categories() {
  return <ProductGridWrapper />;
}

async function ProductGridWrapper() {
  "use cache";
  cacheLife("oneweek");
  const products = await db.query.product.findMany({
    where: (product, operator) => operator.eq(product.isArchived, false),
    orderBy: (product, operator) => operator.asc(product.listOrder),
    columns: {
      id: true,
      images: true,
      placeholderImages: true,
      title: true,
      category: true,
      price: true,
      color: true,
    },
  });

  return <ProductGrid products={products} />;
}
