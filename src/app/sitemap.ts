import { db } from "@/db/instance";
import { categories } from "@/lib/zod-schemas";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseURL = "https://airaclothing.in";

  async function getProducts() {
    const products = await db.query.product.findMany({
      where: (product, o) => o.eq(product.isArchived, false),
      columns: {
        id: true,
        category: true,
      },
    });

    const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
      url: `${baseURL}/${product.category.replaceAll(" ", "-")}/${product.id}`,
      priority: 1,
      changeFrequency: "daily",
    }));
    return productEntries;
  }
  const productEntries = await getProducts();
  const allCategories: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseURL}/${category.replaceAll(" ", "-")}`,
    changeFrequency: "weekly",
  }));

  return [
    ...allCategories,
    ...productEntries,
    { url: `${baseURL}` },
    { url: `${baseURL}/about` },
  ];
}
