import prisma from "@/lib/prisma";
import {MetadataRoute} from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseURL = "https://airaa.vercel.app";
  const products = await prisma.product.findMany({
    where: {
      isArchived: false,
    },
  });

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseURL}/${product.category}/${product.id}`,
  }));

  return [
    ...productEntries,
    { url: `${baseURL}` },
    { url: `${baseURL}/signin` },
    { url: `${baseURL}/signup` },
    { url: `${baseURL}/about` },
  ];
}
