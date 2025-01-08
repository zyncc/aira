import React, {Suspense} from "react";
import ProductGrid from "./ProductGrid";
import {Skeleton} from "@/components/ui/skeleton";
import {categoryCheck} from "@/lib/zodSchemas";
import {notFound} from "next/navigation";
import {capitalizeFirstLetter} from "@/lib/caplitaliseFirstLetter";
import {Metadata} from "next";

export async function generateMetadata({
  params: { category },
}: Params): Promise<Metadata> {
  return {
    title: `${capitalizeFirstLetter(category)} - Aira`,
  };
}

type Params = {
  params: {
    category: string;
  };
};

export async function generateStaticParams() {
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
  return categories.map((category) => ({
    category,
  }));
}

const Men = async ({ params: { category } }: Params) => {
  const validation = categoryCheck.safeParse(category);
  if (!validation.success) {
    return notFound();
  }
  const res = await fetch(
    process.env.NODE_ENV == "development"
      ? `http://localhost:3000/api/fetchCategory?category=${validation.data}`
      : `https://airaa.vercel.app/api/fetchCategory?category=${validation.data}`,
    {
      next: {
        revalidate: 3600,
      },
    }
  );
  const products = await res.json();
  // await new Promise((resolve) =>
  //   setTimeout((resolve) => {
  //     resolve;
  //   }, 600)
  // );
  const number = [];
  for (let i = 1; i <= 10; i++) number.push(i);
  return (
    <>
      <div>
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
          <ProductGrid products={products} category={validation.data} />
        </Suspense>
      </div>
    </>
  );
};

export default Men;
