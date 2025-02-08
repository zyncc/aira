import prisma from "@/lib/prisma";
import { MetadataRoute } from "next";
import { NextResponse } from "next/server";

export async function GET() {
  const baseURL = "https://pansy.in";
  const products = await prisma.product.findMany({
    where: {
      isArchived: false,
    },
  });

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseURL}/${product.category}/${product.id}`,
  }));

  return NextResponse.json(productEntries);
}
