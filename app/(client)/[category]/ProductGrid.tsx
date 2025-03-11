"use client";

import ProductCard from "@/components/cards/productCard";
import { Products } from "@/lib/types";
// import { usePathname, useRouter, useSearchParams } from "next/navigation";
// import { Label } from "@/components/ui/label";
// import {
//   Pagination,
//   PaginationContent,
//   PaginationEllipsis,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination";
// import { Button } from "@/components/ui/button";
import { capitalizeFirstLetter } from "@/lib/caplitaliseFirstLetter";
import { PackageSearch, SlidersHorizontal } from "lucide-react";
// import {
//   Drawer,
//   DrawerClose,
//   DrawerContent,
//   DrawerDescription,
//   DrawerFooter,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerTrigger,
// } from "@/components/ui/drawer";
// import { Slider } from "@/components/ui/slider";
// import formatCurrency from "@/lib/formatCurrency";
// import { useState } from "react";

type Props = {
  products: Products[];
  category: string;
};

// type Size = "sm" | "md" | "lg" | "xl";

// const noOfProducts = 24;

export default function ProductGrid({ products, category }: Props) {
  // const router = useRouter();
  // const pathname = usePathname();
  // const searchParams = useSearchParams();
  // const currentSize = searchParams.get("size") as Size | undefined;
  // const currentColor = searchParams.get("color") || undefined;
  // const currentPage = Number(searchParams.get("page")) || 1;
  // const [priceFilter, setPriceFilter] = useState(0);

  // const createPageURL = (pageNumber: number | string) => {
  //   const params = new URLSearchParams(searchParams);
  //   params.set("page", pageNumber.toString());
  //   return `${pathname}?${params.toString()}`;
  // };
  // const createSizeURL = (size: string) => {
  //   const params = new URLSearchParams(searchParams);
  //   params.set("size", size);
  //   return `${pathname}?${params.toString()}`;
  // };
  // const createColorURL = (color: string) => {
  //   const params = new URLSearchParams(searchParams);
  //   params.set("color", color);
  //   return `${pathname}?${params.toString()}`;
  // };
  // const resetFilters = () => {
  //   console.log("Reset filters");
  //   const params = new URLSearchParams(searchParams);
  //   params.delete("size");
  //   params.delete("color");
  //   return `${pathname}?${params.toString()}`;
  // };

  // const applyFilters = () => {
  //   return products.filter(
  //     (product) =>
  //       (!currentSize || (product.quantity && product.quantity[currentSize])) &&
  //       (!currentColor ||
  //         (product.color && product.color === currentColor.toLowerCase())) &&
  //       (!priceFilter || (product.price && product.price <= priceFilter))
  //   );
  // };

  // const filteredProducts = applyFilters();

  return (
    <>
      <div className="flex w-screen container justify-between mt-[100px] mb-6">
        <h1 className="font-semibold text-2xl">
          {capitalizeFirstLetter(category)}
        </h1>
        {/* <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="flex"
            onClick={() => {
              const redirect = resetFilters();
              router.replace(redirect);
            }}
          >
            Reset Filters
          </Button>
          <Drawer>
            <DrawerTrigger asChild>
              <Button className="gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </Button>
            </DrawerTrigger>
            <DrawerContent className="h-[70vh]">
              <DrawerHeader>
                <DrawerTitle>Apply Filters</DrawerTitle>
                <DrawerDescription>
                  Refine your product search
                </DrawerDescription>
              </DrawerHeader>
              <div className="space-y-4 px-4">
                <FilterSection
                  title="Size"
                  options={["sm", "md", "lg", "xl"]}
                  selectedOptions={[currentSize!]}
                  onChange={(value) => {
                    const redirect = createSizeURL(value);
                    router.replace(redirect);
                  }}
                />
                <FilterSection
                  title="Color"
                  options={["White", "Black", "Blue", "Red", "Green"]}
                  selectedOptions={[currentColor!]}
                  onChange={(value) => {
                    const redirect = createColorURL(value);
                    router.replace(redirect);
                  }}
                />
                <div>
                  <Label>
                    Price Range (Selected Price{" "}
                    {formatCurrency(priceFilter).split(".")[0]})
                  </Label>
                  <Slider
                    min={0}
                    max={10000}
                    step={100}
                    value={[priceFilter]}
                    onValueChange={(value) => setPriceFilter(value[0])}
                    className="mt-2"
                  />
                  <div className="flex justify-between mt-2">
                    <span>{formatCurrency(400).split(".")[0]}</span>
                    <span>{formatCurrency(10000).split(".")[0]}</span>
                  </div>
                </div>
              </div>
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button
                    onClick={() => {
                      const redirect = resetFilters();
                      router.replace(redirect);
                    }}
                  >
                    Reset Filters
                  </Button>
                </DrawerClose>
                <DrawerClose asChild>
                  <Button variant="outline">Close</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div> */}
      </div>
      {products.length === 0 && (
        <div className="flex flex-col items-center w-screen justify-center py-12 px-4">
          <div className="relative mb-6">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary/20 to-primary/30 blur-lg" />
            <div className="relative bg-background rounded-full p-4">
              <PackageSearch className="w-12 h-12 text-primary" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center mb-3">
            No matches found
          </h2>
          <p className="text-muted text-center max-w-[400px] mb-6">
            We couldn't find any products matching your current filters. Try
            adjusting your selection or start fresh.
          </p>
        </div>
      )}
      <div className="flex lg:container md:container lg:flex-row gap-8 items-start">
        <div className="grid grid-cols-2 px-2 md:px-0 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full md:pb-5 lg:pb-7">
          {products?.map((product) => (
            <ProductCard
              key={product.id}
              image={product.images[0]}
              placeholder={product.placeholderImages[0]}
              title={product.title}
              price={product.price}
              category={product.category}
              color={product.color}
              id={product.id}
            />
          ))}
        </div>
      </div>
      {/* {products.length > 0 && (
        <Pagination className="my-5">
          <PaginationContent>
            <PaginationItem className={`${currentPage == 1 && "hidden"}`}>
              <PaginationPrevious href={`?page=1`} />
            </PaginationItem>
            <PaginationItem className={`${currentPage == 1 && "hidden"}`}>
              <PaginationLink href={createPageURL(currentPage - 1)}>
                {currentPage - 1}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem
              className={`${filteredProducts.length < 24 && "hidden"}`}
            >
              <PaginationLink href={createPageURL(currentPage)} isActive>
                {currentPage}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem
              className={`${products.length < noOfProducts && "hidden"}`}
            >
              <PaginationLink href={createPageURL(currentPage + 1)}>
                {currentPage + 1}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem
              className={`${products.length < noOfProducts && "hidden"}`}
            >
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem
              className={`${products.length < noOfProducts && "hidden"}`}
            >
              <PaginationNext href={createPageURL(currentPage + 1)} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )} */}
    </>
  );
}

// type FilterSectionProps = {
//   title: string;
//   options: string[];
//   selectedOptions: string[];
//   onChange: (value: string) => void;
// };

// function FilterSection({
//   title,
//   options,
//   selectedOptions,
//   onChange,
// }: FilterSectionProps) {
//   return (
//     <div>
//       <Label>{title}</Label>
//       <div className="space-y-2 mt-2">
//         {options.map((option) => (
//           <div key={option} className="flex items-center">
//             <input
//               type="checkbox"
//               id={option}
//               checked={selectedOptions.includes(option)}
//               onChange={() => onChange(option)}
//               className="mr-2"
//             />
//             <label htmlFor={option}>
//               {(option == "sm" && "Small") ||
//                 (option == "md" && "Medium") ||
//                 (option == "lg" && "Large") ||
//                 (option == "xl" && "XL") ||
//                 option}
//             </label>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
