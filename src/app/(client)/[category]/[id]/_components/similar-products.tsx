import { db } from "@/db/instance";
import { and, eq, not } from "drizzle-orm";
import { cacheLife } from "next/cache";
import SimilarProductsCarousel from "./similar-products-carousel";

type Params = {
  category: string;
  id: string;
};

export default async function SimilarProducts({ id, category }: Params) {
  "use cache";
  cacheLife("oneweek");
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
          <h2 className="text-primary mb-4 text-center text-xl font-semibold uppercase md:text-left">
            You may also Like
          </h2>
          <SimilarProductsCarousel similarProducts={similarProducts} />
        </div>
      )}
    </div>
  );
}
