import { db } from "@/db/instance";
import { categories, categoryCheck } from "@/lib/zod-schemas";
import { and, desc, eq } from "drizzle-orm";
import _ from "lodash";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import ProductGrid from "./_components/product-grid";

export const revalidate = 86400;

export function generateStaticParams() {
  return categories.map((category) => ({
    category,
  }));
}

export default async function Categories({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const { success, data: validCategory } = categoryCheck.safeParse(
    category.replaceAll("-", " ").toLowerCase(),
  );

  if (!success) {
    return redirect("/not-found");
  }

  const products = await db.query.product.findMany({
    where: (product) =>
      and(eq(product.category, validCategory), eq(product.isArchived, false)),
    orderBy: (product) => desc(product.createdAt),
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

  return <ProductGrid products={products} category={category} />;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  return {
    metadataBase: new URL("https://airaclothing.in"),
    title: `${_.capitalize(category.replaceAll("-", " "))}`,
    description: "Affordable Summer Clothing made from 100% Linen Fabric",
  };
}
