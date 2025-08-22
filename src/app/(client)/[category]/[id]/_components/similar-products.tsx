import { db } from "@/db/instance";
import { and, eq, not } from "drizzle-orm";
import SimilarProductsCarousel from "./similar-products-carousel";

type Params = {
  params: Promise<{
    category: string;
    id: string;
  }>;
};

export default async function SimilarProducts({ params }: Params) {
  const { id, category } = await params;

  const similarProducts = await db.query.product.findMany({
    where: (product) =>
      and(
        eq(product.category, category.replaceAll("-", " ")),
        not(eq(product.id, id)),
        eq(product.isArchived, false),
      ),
    limit: 5,
  });

  return (
    <div className="mb-10">
      {similarProducts.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-8 text-2xl font-semibold">You may also Like</h2>
          <SimilarProductsCarousel similarProducts={similarProducts} />
        </div>
      )}
    </div>
  );
}
