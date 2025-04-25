import { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseURL = "https://pansy.in";

  async function  getProducts() {
    "use server";
    const products = await prisma.product.findMany({
      where: {
        isArchived: false,
      },
    });

    const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
      url: `${baseURL}/${product.category}/${product.id}`,
    }));
    return productEntries;
  }
  const productEntries = await getProducts()

  return [
    ...productEntries,
    { url: `${baseURL}` },
    { url: `${baseURL}/signin` },
    { url: `${baseURL}/signup` },
    { url: `${baseURL}/about` },
  ];
}
