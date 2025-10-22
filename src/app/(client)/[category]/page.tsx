import { db } from "@/db/instance";
import { categories, categoryCheck } from "@/lib/zod-schemas";
import { and, desc, eq } from "drizzle-orm";
import _ from "lodash";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductGrid from "./_components/product-grid";
import { cacheLife } from "next/cache";

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
  "use cache";
  cacheLife("oneday");
  const { category } = await params;
  const { success, data: validCategory } = categoryCheck.safeParse(
    category.replaceAll("-", " ").toLowerCase(),
  );

  if (!success) {
    return notFound();
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
  const { success } = categoryCheck.safeParse(
    category.replaceAll("-", " ").toLowerCase(),
  );

  if (!success) {
    return {
      metadataBase: new URL("https://airaclothing.in"),
      title: "Page Not Found",
    };
  }

  return {
    metadataBase: new URL("https://airaclothing.in"),
    title: `${_.capitalize(category.replaceAll("-", " "))}`,
    description: "Affordable Summer Clothing made from 100% Linen Fabric",
  };
}
