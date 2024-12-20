import React, { cache } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import prisma from "@/lib/prisma";
import { EmblaOptionsType } from "embla-carousel";
import { Metadata } from "next";
import ProductSlider from "@/components/carousel/productSlider";
import RightPage from "./components/rightPage";
import Image from "next/image";
import Link from "next/link";
import formatCurrency from "@/lib/formatCurrency";
import Reviews from "./components/reviews";
import { notFound } from "next/navigation";
import Footer from "@/components/footer/footer";
import { headers } from "next/headers";
import { auth } from "@/auth";

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
  // await new Promise((resolve) => {
  //   setTimeout(() => {
  //     resolve("Loading complete");
  //   }, 2000000000);
  // });

  const session = await auth.api.getSession({
    headers: headers(),
  });
  const [similarProductsResult, productsInCategoryResult] =
    await Promise.allSettled([
      prisma.product.findMany({
        where: {
          isArchived: false,
          color: {
            hasSome: [product.color[0]],
          },
          category: product.category,
          id: {
            not: product.id,
          },
        },
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.product.findMany({
        where: {
          isArchived: false,
          category: product.category,
          id: {
            not: product.id,
          },
        },
        take: 6,
      }),
    ]);

  const similarProducts =
    similarProductsResult.status === "fulfilled"
      ? similarProductsResult.value
      : [];
  const productsInCategory =
    productsInCategoryResult.status === "fulfilled"
      ? productsInCategoryResult.value
      : [];

  const { title } = product;
  const OPTIONS: EmblaOptionsType = {};
  return (
    <>
      <section className="md:py-[40px] max-[768px]:pt-[0px]">
        <Breadcrumb className="container hidden md:block">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/men">Men</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-medium">
                {title.replaceAll(" ", "-").toLowerCase()}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex md:mt-10 flex-wrap md:flex-nowrap gap-12 md:container">
          <div className="md:basis-1/2">
            <ProductSlider product={product} options={OPTIONS} />
          </div>
          <RightPage product={product} session={session} />
        </div>
        <Reviews id={id} />
        {similarProducts.length > 0 && (
          <div className="container mt-[80px]">
            <h1 className="text-2xl font-semibold">Similar Products</h1>
            <div className="similar gap-2 mt-6 overflow-x-auto flex">
              {similarProducts.map((similarProduct) => (
                <div
                  className="w-[400px] flex-shrink-0 pb-4"
                  key={similarProduct.id}
                >
                  <Link
                    href={`/${similarProduct.category}/${similarProduct.id}`}
                  >
                    <Image
                      key={similarProduct.id}
                      src={similarProduct.images[0]}
                      height={400}
                      width={400}
                      alt="similar products"
                      className="cursor-pointer object-cover aspect-square"
                    />
                  </Link>
                  <Link
                    href={`/${similarProduct.category}/${similarProduct.id}`}
                  >
                    <h1 className="mt-1 font-medium">{similarProduct.title}</h1>
                  </Link>
                  <h2 className="font-medium">
                    {formatCurrency(similarProduct.price).split(".")[0]}
                  </h2>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="container mt-[80px]">
          <h1 className="text-2xl font-semibold">You might like these</h1>
          <div className="similar gap-2 mt-6 overflow-x-auto flex">
            {productsInCategory.map((similarProduct) => (
              <div
                className="w-[400px] flex-shrink-0 pb-4"
                key={similarProduct.id}
              >
                <Link href={`/${similarProduct.category}/${similarProduct.id}`}>
                  <Image
                    key={similarProduct.id}
                    src={similarProduct.images[0]}
                    height={400}
                    width={400}
                    alt="similar products"
                    className="cursor-pointer object-cover aspect-square"
                  />
                </Link>
                <Link href={`/${similarProduct.category}/${similarProduct.id}`}>
                  <h1 className="mt-1 font-medium">{similarProduct.title}</h1>
                </Link>
                <h2 className="font-medium">
                  {formatCurrency(similarProduct.price).split(".")[0]}
                </h2>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default ProductById;

export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    where: {
      category: "men",
      isArchived: false,
    },
    include: {
      quantity: true,
    },
  });
  return products.map((product) => ({
    id: product.id,
  }));
}

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
      url: product.images[0],
    },
  };
}
