import React, { cache, Suspense } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import prisma from "@/lib/prisma";
import { Metadata } from "next";
import ProductSlider from "@/components/carousel/productSlider";
import RightPage from "./components/rightPage";
import Reviews from "./components/reviews";
import { notFound } from "next/navigation";
import Footer from "@/components/footer/footer";
import { headers } from "next/headers";
import { auth } from "@/auth";
import { capitalizeFirstLetter } from "@/lib/caplitaliseFirstLetter";
import ReviewsSkeleton from "@/components/skeletons/Reviews";
import SimilarProductsSkeleton from "@/components/skeletons/SimilarProducts";
import SimilarProducts from "./components/SimilarProducts";

type Params = {
  params: {
    id: string;
  };
};

const getProduct = cache(async (id: string) => {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id,
        isArchived: false,
      },
      include: {
        quantity: true,
      },
    });
    return product;
  } catch (error) {
    console.log(error);
  }
});

const ProductById = async ({ params: { id } }: Params) => {
  const product = await getProduct(id);
  if (!product?.title) {
    notFound();
  }
  // await new Promise<void>(
  //   (resolve) =>
  //     setTimeout(() => {
  //       resolve();
  //     }, 300000) // Simulates a 3-second delay
  // );
  const session = await auth.api.getSession({
    headers: headers(),
  });

  const { title } = product;

  return (
    <>
      <section className="max-[768px]:pt-[0px] md:mt-[100px] pb-[50px]">
        <Breadcrumb className="container hidden md:block">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/${product.category}`}>
                {capitalizeFirstLetter(product.category)}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-medium">{title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex mt-[50px] md:mt-10 flex-wrap md:flex-nowrap gap-5 md:container">
          <div className="md:basis-1/2">
            <ProductSlider product={product} />
          </div>
          <RightPage product={product} session={session} />
        </div>
        <Suspense fallback={<ReviewsSkeleton />}>
          <Reviews id={id} category={product.category} />
        </Suspense>
        <Suspense fallback={<SimilarProductsSkeleton />}>
          <SimilarProducts product={product} />
        </Suspense>
      </section>
      <Footer />
    </>
  );
};

export default ProductById;

export async function generateMetadata({
  params: { id },
}: Params): Promise<Metadata> {
  const product = await getProduct(id);
  if (!product?.title) {
    return {
      title: "Product does not Exist",
    };
  }
  return {
    title: `${product.title} - Aira`,
    description: product.description,
    openGraph: {
      images: [
        {
          url: product.images[0],
          width: 1080,
          height: 1350,
          alt: product.title,
        },
      ],
    },
  };
}
