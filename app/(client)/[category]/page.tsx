import React, { Suspense } from "react";
import ProductGrid from "./ProductGrid";
import { Skeleton } from "@/components/ui/skeleton";
import { categoryCheck, pageNumber } from "@/lib/zodSchemas";
import { notFound } from "next/navigation";
import { capitalizeFirstLetter } from "@/lib/caplitaliseFirstLetter";
import { Metadata } from "next";
import prisma from "@/lib/prisma";

const categories = [
  "men",
  "co-ord-sets",
  "pants",
  "jumpsuits",
  "shorts",
  "dresses",
  "outerwear",
  "tops",
  "skirts",
  "lounge-wear",
];

export async function generateMetadata(props: Params): Promise<Metadata> {
  const params = await props.params;

  const {
    category
  } = params;

  return {
    title: `${capitalizeFirstLetter(category)} - Aira`,
  };
}

type Params = {
  params: Promise<{
    category: string;
  }>;
};

export async function generateStaticParams() {
  return categories.map((category) => ({
    category,
  }));
}

const noOfProducts = 24;

const Men = async (
  props: {
    params: Promise<{ category: string }>;
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
  }
) => {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const validation = categoryCheck.safeParse(params.category);
  if (!validation.success) {
    return notFound();
  }
  const page = Number(searchParams?.page) || 1;

  if (isNaN(page) || !Number.isInteger(page) || page <= 0) {
    return notFound();
  }
  const checkPageNumber = pageNumber.safeParse(page);
  if (!checkPageNumber.success) {
    console.error(checkPageNumber.error);
    return notFound();
  }

  let skip: number;
  if (page == 1) {
    skip = 0;
  } else {
    skip = noOfProducts * (page - 1);
  }

  const number = [];
  for (let i = 1; i <= 10; i++) number.push(i);
  return (
    <>
      <Suspense
        fallback={
          <div className="pt-[40px] md:container">
            <div className="flex justify-between container">
              <h1 className="font-semibold text-2xl">
                {capitalizeFirstLetter(validation.data)}
              </h1>
            </div>
            <div className="md:m-2 grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-[2px] md:gap-5 lg:gap-7 py-10">
              {number.map((key) => (
                <div key={key} className="w-[100%]">
                  <Skeleton className="w-full aspect-square rounded-none" />
                  <Skeleton className="w-[80%] h-[20px] mt-2 max-w-[768px]:ml-2" />
                  <Skeleton className="w-[65%] h-[20px] mt-2 max-w-[768px]:ml-2 max-w-[768px]:mb-2" />
                </div>
              ))}
            </div>
          </div>
        }
      >
        <ProductGridWrapper params={params} searchParams={searchParams} />
      </Suspense>
    </>
  );
};

export default Men;

async function ProductGridWrapper({
  params,
  searchParams,
}: {
  params: { category: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const validation = categoryCheck.safeParse(params.category);
  if (!validation.success) {
    return notFound();
  }
  const page = Number(searchParams?.page) || 1;

  if (isNaN(page) || !Number.isInteger(page) || page <= 0) {
    return notFound();
  }
  const checkPageNumber = pageNumber.safeParse(page);
  if (!checkPageNumber.success) {
    console.error(checkPageNumber.error);
    return notFound();
  }

  let skip: number;
  if (page == 1) {
    skip = 0;
  } else {
    skip = noOfProducts * (page - 1);
  }
  const products = await prisma.product.findMany({
    where: {
      category: validation.data,
      isArchived: false,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      quantity: true,
    },
    take: noOfProducts,
    skip: skip,
  });
  return <ProductGrid products={products} category={validation.data} />;
}
