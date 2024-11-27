"use client";

import ProductCard from "@/components/cards/productCard";
import {Products} from "@/lib/types";
import {useSearchParams} from "next/navigation";
import {Label} from "@/components/ui/label";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Sheet, SheetContent, SheetHeader, SheetTrigger,} from "@/components/ui/sheet";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {ScrollArea} from "@/components/ui/scroll-area";
import {useInView} from "react-intersection-observer";
import {useEffect} from "react";
import {CgSpinner} from "react-icons/cg";
import {InfiniteProducts} from "@/actions/infiniteData";
import {useInfiniteQuery} from "@tanstack/react-query";

type Props = {
  products: Products[];
};

export default function ProductGrid({ products }: Props) {
  const searchParams = useSearchParams();
  const { ref, inView } = useInView();
  const min = Number(searchParams.get("min"));
  const max = Number(searchParams.get("max"));
  const size = searchParams.get("size");
  const color = searchParams.get("color");

  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ["infiniteProducts"],
    queryFn: ({ pageParam = 1 }) => InfiniteProducts(pageParam),
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = lastPage.length ? allPages.length + 1 : undefined;
      return nextPage;
    },
  });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  });

  let filteredProducts: Products[] = products;

  if (max && min) {
    const priceFilter = filteredProducts.filter((item) => {
      return item.price < max && item.price > min;
    });
    filteredProducts = priceFilter;
  }

  if (size) {
    const sizeFilter = filteredProducts.filter((item) => {
      if (size == "any") return item;
      if (size == "sm") return item.quantity?.sm != 0;
      if (size == "md") return item.quantity?.md != 0;
      if (size == "lg") return item.quantity?.lg != 0;
      if (size == "xl") return item.quantity?.xl != 0;
    });
    filteredProducts = sizeFilter;
  }

  if (color) {
    const colorFilter = filteredProducts.filter((item) => {
      if (color == "any") return item;
      if (color == "black") return item.color.indexOf("black") > -1;
      if (color == "blue") return item.color.indexOf("blue") > -1;
      if (color == "green") return item.color.indexOf("green") > -1;
      if (color == "white") return item.color.indexOf("white") > -1;
      if (color == "pink") return item.color.indexOf("pink") > -1;
      if (color == "red") return item.color.indexOf("red") > -1;
      if (color == "brown") return item.color.indexOf("brown") > -1;
      if (color == "beige") return item.color.indexOf("beige") > -1;
    });
    filteredProducts = colorFilter;
  }
  return (
    <>
      <div className="flex w-screen container justify-between mt-6 mb-6">
        <h1 className="font-semibold text-2xl">Men</h1>
        <Sheet>
          <div className="flex gap-3">
            <Link href={"/men"}>
              <Button variant={"secondary"}>Reset Filters</Button>
            </Link>
            <SheetTrigger className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center px-3 py-2 rounded-lg font-semibold">
              Filters
            </SheetTrigger>
          </div>
          <SheetContent side={"left"}>
            <ScrollArea className="h-full">
              <SheetHeader>
                <div className="text-left">
                  <div>
                    <h1 className="font-medium text-lg mb-3 mt-3">Price</h1>
                    <RadioGroup defaultValue="option-one">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`?min=0&max=100000&size=${
                            size || "any"
                          }&color=${color || "any"}`}
                          scroll={false}
                          replace
                        >
                          <RadioGroupItem
                            value="price-option-zero"
                            id="price-option-zero"
                            checked={min == 0 && max == 100000}
                          />
                        </Link>
                        <Label
                          className="cursor-pointer"
                          htmlFor="price-option-zero"
                        >
                          Any
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`?min=0&max=5000&size=${size || "any"}&color=${
                            color || "any"
                          }`}
                          scroll={false}
                          replace
                        >
                          <RadioGroupItem
                            value="price-option-one"
                            id="price-option-one"
                            checked={min == 0 && max == 5000}
                          />
                        </Link>
                        <Label
                          className="cursor-pointer"
                          htmlFor="price-option-one"
                        >
                          Under ₹5000
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`?min=5000&max=10000&size=${
                            size || "any"
                          }&color=${color || "any"}`}
                          scroll={false}
                          replace
                        >
                          <RadioGroupItem
                            value="price-option-two"
                            id="price-option-two"
                            checked={min == 5000 && max == 10000}
                          />
                        </Link>
                        <Label
                          className="cursor-pointer"
                          htmlFor="price-option-two"
                        >
                          ₹5000 - ₹10,000
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`?min=10000&max=15000&size=${
                            size || "any"
                          }&color=${color || "any"}`}
                          scroll={false}
                          replace
                        >
                          <RadioGroupItem
                            value="price-option-three"
                            id="price-option-three"
                            checked={min == 10000 && max == 15000}
                          />
                        </Link>
                        <Label
                          className="cursor-pointer"
                          htmlFor="price-option-three"
                        >
                          ₹10,000 - ₹15,000
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`?min=15000&max=150000&size=${
                            size || "any"
                          }&color=${color || "any"}`}
                          scroll={false}
                          replace
                        >
                          <RadioGroupItem
                            value="price-option-four"
                            id="price-option-four"
                            checked={min == 15000 && max == 150000}
                          />
                        </Link>
                        <Label
                          className="cursor-pointer"
                          htmlFor="price-option-four"
                        >
                          Above ₹15,000
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div>
                    <h1 className="font-medium text-lg mb-3 mt-3">Size</h1>
                    <RadioGroup defaultValue="option-one">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`?min=${min || 0}&max=${
                            max || 100000
                          }&size=any&color=${color || "any"}`}
                          scroll={false}
                          replace
                        >
                          <RadioGroupItem
                            value="size-option-zero"
                            id="size-option-zero"
                            checked={size == "any"}
                          />
                        </Link>
                        <Label
                          className="cursor-pointer"
                          htmlFor="size-option-zero"
                        >
                          Any
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`?min=${min || 0}&max=${
                            max || 100000
                          }&size=sm&color=${color || "any"}`}
                          scroll={false}
                          replace
                        >
                          <RadioGroupItem
                            value="size-option-one"
                            id="size-option-one"
                            checked={size == "sm"}
                          />
                        </Link>
                        <Label
                          className="cursor-pointer"
                          htmlFor="size-option-one"
                        >
                          Small
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`?min=${min || 0}&max=${
                            max || 100000
                          }&size=md&color=${color || "any"}`}
                          scroll={false}
                          replace
                        >
                          <RadioGroupItem
                            value="size-option-two"
                            id="size-option-two"
                            checked={size == "md"}
                          />
                        </Link>
                        <Label
                          className="cursor-pointer"
                          htmlFor="size-option-two"
                        >
                          Medium
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`?min=${min || 0}&max=${
                            max || 100000
                          }&size=lg&color=${color || "any"}`}
                          scroll={false}
                          replace
                        >
                          <RadioGroupItem
                            value="size-option-three"
                            id="size-option-three"
                            checked={size == "lg"}
                          />
                        </Link>
                        <Label
                          className="cursor-pointer"
                          htmlFor="size-option-three"
                        >
                          Large
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`?min=${min || 0}&max=${
                            max || 100000
                          }&size=xl&color=${color || "any"}`}
                          scroll={false}
                          replace
                        >
                          <RadioGroupItem
                            value="size-option-four"
                            id="size-option-four"
                            checked={size == "xl"}
                          />
                        </Link>
                        <Label
                          className="cursor-pointer"
                          htmlFor="size-option-four"
                        >
                          Extra Large
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div>
                    <h1 className="font-medium text-lg mb-3 mt-3">Colors</h1>
                    <RadioGroup defaultValue="option-one">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`?min=${min || 0}&max=${max || 100000}&size=${
                            size || "any"
                          }&color=any`}
                          scroll={false}
                          replace
                        >
                          <RadioGroupItem
                            value="color-option-zero"
                            id="color-option-zero"
                            checked={color == "any"}
                          />
                        </Link>
                        <Label
                          className="cursor-pointer"
                          htmlFor="color-option-zero"
                        >
                          <div className="flex gap-2">Any</div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`?min=${min || 0}&max=${max || 100000}&size=${
                            size || "any"
                          }&color=black`}
                          scroll={false}
                          replace
                        >
                          <RadioGroupItem
                            value="color-option-one"
                            id="color-option-one"
                            checked={color == "black"}
                          />
                        </Link>
                        <Label
                          className="cursor-pointer"
                          htmlFor="color-option-one"
                        >
                          <div className="flex gap-2">
                            Black
                            <div className="h-4 w-4 rounded-full bg-black"></div>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`?min=${min || 0}&max=${max || 100000}&size=${
                            size || "any"
                          }&color=blue`}
                          scroll={false}
                          replace
                        >
                          <RadioGroupItem
                            value="color-option-two"
                            id="color-option-two"
                            checked={color == "blue"}
                          />
                        </Link>
                        <Label
                          className="cursor-pointer"
                          htmlFor="color-option-two"
                        >
                          <div className="flex gap-2">
                            Blue
                            <div className="h-4 w-4 rounded-full bg-blue-400"></div>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`?min=${min || 0}&max=${max || 100000}&size=${
                            size || "any"
                          }&color=green`}
                          scroll={false}
                          replace
                        >
                          <RadioGroupItem
                            value="color-option-three"
                            id="color-option-three"
                            checked={color == "green"}
                          />
                        </Link>
                        <Label
                          className="cursor-pointer"
                          htmlFor="color-option-three"
                        >
                          <div className="flex gap-2">
                            Green
                            <div className="h-4 w-4 rounded-full bg-green-700"></div>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`?min=${min || 0}&max=${max || 100000}&size=${
                            size || "any"
                          }&color=white`}
                          scroll={false}
                          replace
                        >
                          <RadioGroupItem
                            value="color-option-four"
                            id="color-option-four"
                            checked={color == "white"}
                          />
                        </Link>
                        <Label
                          className="cursor-pointer"
                          htmlFor="color-option-four"
                        >
                          <div className="flex gap-2">
                            White
                            <div className="h-4 w-4 rounded-full bg-white border-[1px] border-black"></div>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`?min=${min || 0}&max=${max || 100000}&size=${
                            size || "any"
                          }&color=pink`}
                          scroll={false}
                          replace
                        >
                          <RadioGroupItem
                            value="color-option-five"
                            id="color-option-five"
                            checked={color == "pink"}
                          />
                        </Link>
                        <Label
                          className="cursor-pointer"
                          htmlFor="color-option-five"
                        >
                          <div className="flex gap-2">
                            Pink
                            <div className="h-4 w-4 rounded-full bg-pink-500"></div>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`?min=${min || 0}&max=${max || 100000}&size=${
                            size || "any"
                          }&color=red`}
                          scroll={false}
                          replace
                        >
                          <RadioGroupItem
                            value="color-option-six"
                            id="color-option-six"
                            checked={color == "red"}
                          />
                        </Link>
                        <Label
                          className="cursor-pointer"
                          htmlFor="color-option-six"
                        >
                          <div className="flex gap-2">
                            Red
                            <div className="h-4 w-4 rounded-full bg-red-500"></div>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`?min=${min || 0}&max=${max || 100000}&size=${
                            size || "any"
                          }&color=brown`}
                          scroll={false}
                          replace
                        >
                          <RadioGroupItem
                            value="color-option-seven"
                            id="color-option-seven"
                            checked={color == "brown"}
                          />
                        </Link>
                        <Label
                          className="cursor-pointer"
                          htmlFor="color-option-seven"
                        >
                          <div className="flex gap-2">
                            Brown
                            <div className="h-4 w-4 rounded-full bg-[#964B00]"></div>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`?min=${min || 0}&max=${max || 100000}&size=${
                            size || "any"
                          }&color=beige`}
                          scroll={false}
                          replace
                        >
                          <RadioGroupItem
                            value="color-option-eight"
                            id="color-option-eight"
                            checked={color == "beige"}
                          />
                        </Link>
                        <Label
                          className="cursor-pointer"
                          htmlFor="color-option-eight"
                        >
                          <div className="flex gap-2">
                            Beige
                            <div className="h-4 w-4 rounded-full bg-[#F5F5DC]"></div>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                <Link href={"/men"}>
                  <Button variant={"destructive"} className="mt-10">
                    Reset Filters
                  </Button>
                </Link>
              </SheetHeader>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>
      <div className="flex lg:container md:container lg:flex-row gap-8 items-start">
        <div className="md:m-0 grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 md:gap-5 lg:gap-7 pb-10">
          {filteredProducts.length == 0 ? (
            <div>
              <h1 className="font-medium text-xl">
                No Products match your Filter requirements
              </h1>
            </div>
          ) : (
            filteredProducts?.map((product) => (
              <ProductCard
                key={product.id}
                image={product.images[0]}
                placeholder={product.placeholderImages[0]}
                title={product.title}
                price={product.price}
                category={product.category}
                id={product.id}
              />
            ))
          )}
        </div>
      </div>
      <div className="w-full container">
        <div className="flex lg:container md:container lg:flex-row gap-8 items-start">
          <div className="md:m-0 grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2  md:gap-5 lg:gap-7 md:pb-5 lg:pb-7">
            {data?.pages.map((page) => {
              return page.map((product) => (
                <ProductCard
                  key={product.id}
                  image={product.images[0]}
                  placeholder={product.placeholderImages[0]}
                  title={product.title}
                  price={product.price}
                  category={product.category}
                  id={product.id}
                />
              ));
            })}
          </div>
        </div>
        {hasNextPage && (
          <div ref={ref} className="w-full flex items-center justify-center">
            <CgSpinner className="animate-spin my-10" size={40} />
          </div>
        )}
      </div>
    </>
  );
}
