import SimilarProductsCarousel from "@/components/carousel/similarProducts";
import { Product } from "@prisma/client";

export default async function SimilarProducts({
  similarProducts,
}: {
  similarProducts: Product[];
}) {
  //   await new Promise<void>(
  //     (resolve) =>
  //       setTimeout(() => {
  //         resolve();
  //       }, 300000) // Simulates a 3-second delay
  //   );
  return (
    <div>
      {similarProducts.length > 0 && (
        <div className="container mx-auto mt-10">
          <h2 className="text-2xl font-semibold mb-8">Similar Products</h2>
          <SimilarProductsCarousel similarProducts={similarProducts} />
        </div>
      )}
    </div>
  );
}
