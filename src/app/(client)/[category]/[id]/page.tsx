import { Container } from "@/components/container";
import Footer from "@/components/footer";
import GoogleOneTap from "@/components/google-one-tap";
import { db } from "@/db/instance";
import { GetProductSchema } from "@/lib/constants";
import { Product } from "@/lib/types";
import { extractDescription } from "@/lib/utils";
import { and, eq } from "drizzle-orm";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { cache, Suspense } from "react";
import { QuantityLoader, ReviewsSkeleton } from "./_components/_loaders";
import DynamicQuantityClient from "./_components/dynamic-quantity-client";
import ProductSlider from "./_components/product-slider";
import Reviews from "./_components/reviews";
import RightBottom from "./_components/right-bottom";
import RightPage from "./_components/right-page";
import SimilarProducts from "./_components/similar-products";

type Params = {
  params: Promise<{
    category: string;
    id: string;
  }>;
};

// export async function generateStaticParams() {
//   const product = await db.query.product.findMany({
//     where: (product, o) => o.eq(product.isArchived, false),
//     columns: { id: true, category: true },
//   });
//   return product.map((prod) => ({
//     category: prod.category.replaceAll(" ", "-"),
//     id: prod.id,
//   }));
// }

export const experimental_ppr = true;

const getProduct = cache(async (id: string, category: string) => {
  return await db.query.product.findFirst({
    where: (product) =>
      and(
        eq(product.id, id),
        eq(product.category, category.replaceAll("-", " ")),
        eq(product.isArchived, false),
      ),
  });
});

export default async function ProductPage({ params }: Params) {
  const { id, category } = await params;
  const product = await getProduct(id, category);
  if (!product) {
    return notFound();
  }
  const StructuredProductSchema = GetProductSchema(product);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(StructuredProductSchema),
        }}
      />
      <Container className="relative flex w-full flex-wrap gap-2 px-0 pb-[30px] max-[768px]:pt-[0px] md:mt-[30px] md:flex-nowrap">
        <div className="md:basis-1/2 md:px-2">
          <ProductSlider product={product} />
        </div>
        <div className="w-full px-2 md:basis-1/2">
          <RightPage product={product} />
          <Suspense fallback={<QuantityLoader />}>
            <DynamicQuantity product={product} />
          </Suspense>
          <RightBottom description={product.description} />
        </div>
      </Container>
      <Container className="px-2">
        <SimilarProducts params={params} />
      </Container>
      <Suspense fallback={<ReviewsSkeleton />}>
        <Reviews params={params} />
      </Suspense>
      <GoogleOneTap />
      <Footer />
    </>
  );
}

async function DynamicQuantity({ product }: { product: Product }) {
  await connection();
  // await new Promise((resolve) => setTimeout(resolve, 3000));
  const quantity = await db.query.quantity.findFirst({
    where: (quantity, operator) => operator.eq(quantity.productId, product.id),
  });
  if (!quantity) {
    throw new Error("Something went wrong");
  }
  return <DynamicQuantityClient productWithoutQuantity={product} quantity={quantity} />;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id, category } = await params;
  const product = await getProduct(id, category);
  if (!product) {
    return {
      title: "Product does not Exist",
    };
  }
  return {
    title: `${product.title}`,
    description: extractDescription(product.description),
    openGraph: {
      images: product.images.map((image) => ({
        url: image,
        width: 1080,
        height: 1350,
        alt: product.title,
      })),
    },
  };
}
