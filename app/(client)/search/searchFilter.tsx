"use client";

import formatCurrency from "@/lib/formatCurrency";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import { useState } from "react";

type Size = "sm" | "md" | "lg" | "xl";

export default function SearchFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSize = searchParams.get("size") as Size | undefined;
  const currentColor = searchParams.get("color") || undefined;
  const [priceFilter, setPriceFilter] = useState(0);
  const createSizeURL = (size: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("size", size);
    return `${pathname}?${params.toString()}`;
  };
  const createColorURL = (color: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("color", color);
    return `${pathname}?${params.toString()}`;
  };
  const resetFilters = () => {
    console.log("Reset filters");
    const params = new URLSearchParams(searchParams);
    params.delete("size");
    params.delete("color");
    return `${pathname}?${params.toString()}`;
  };
  return (
    <div className="flex items-center gap-2">
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
            <DrawerDescription>Refine your product search</DrawerDescription>
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
    </div>
  );
}

type FilterSectionProps = {
  title: string;
  options: string[];
  selectedOptions: string[];
  onChange: (value: string) => void;
};

function FilterSection({
  title,
  options,
  selectedOptions,
  onChange,
}: FilterSectionProps) {
  return (
    <div>
      <Label>{title}</Label>
      <div className="space-y-2 mt-2">
        {options.map((option) => (
          <div key={option} className="flex items-center">
            <input
              type="checkbox"
              id={option}
              checked={selectedOptions.includes(option)}
              onChange={() => onChange(option)}
              className="mr-2"
            />
            <label htmlFor={option}>
              {(option == "sm" && "Small") ||
                (option == "md" && "Medium") ||
                (option == "lg" && "Large") ||
                (option == "xl" && "XL") ||
                option}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
