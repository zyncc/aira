import SimilarProductsCarousel from "@/components/carousel/similarProducts";
import prisma from "@/lib/prisma";
import { Product } from "@prisma/client";

export default async function SimilarProducts({
  product,
}: {
  product: Product;
}) {
  // await new Promise<void>(
  //   (resolve) =>
  //     setTimeout(() => {
  //       resolve();
  //     }, 300000) // Simulates a 3-second delay
  // );
  const similarProducts = await prisma.product.findMany({
    where: {
      isArchived: false,
      category: product.category,
      id: {
        not: product.id,
      },
    },
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="mb-10">
      {similarProducts.length > 0 && (
        <div className="container mx-auto mt-10">
          <h2 className="text-2xl font-semibold mb-8">Similar Products</h2>
          <SimilarProductsCarousel similarProducts={similarProducts} />
        </div>
      )}
    </div>
  );
}
