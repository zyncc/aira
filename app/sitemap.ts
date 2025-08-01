import { MetadataRoute } from "next";
import prisma from "@/lib/prisma";
import { categories } from "@/lib/zodSchemas";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseURL = "https://airaclothing.in";

  async function getProducts() {
    const products = await prisma.product.findMany({
      where: {
        isArchived: false,
      },
      select: {
        category: true,
        id: true,
      },
    });

    const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
      url: `${baseURL}/${product.category}/${product.id}`,
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
