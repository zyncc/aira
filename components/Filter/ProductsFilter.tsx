"use client";

import { SlidersHorizontal, Palette, Ruler, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ModernFilterProps {
  category: string;
}

const sizes = [
  { value: "sm", label: "Small" },
  { value: "md", label: "Medium" },
  { value: "lg", label: "Large" },
  { value: "xl", label: "Extra Large" },
  { value: "doublexl", label: "Double XL" },
];

const colors = [
  { value: "red", label: "Red", color: "bg-red-500" },
  { value: "blue", label: "Blue", color: "bg-blue-500" },
  { value: "black", label: "Black", color: "bg-black" },
  { value: "green", label: "Green", color: "bg-green-500" },
];

function FilterContent({ category }: ModernFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const sizeFilter = useCallback(
    (bool: boolean, value: string) => {
      const params = new URLSearchParams(searchParams);
      if (bool) {
        params.set("size", value);
      } else {
        params.delete("size");
      }
      return params;
    },
    [searchParams]
  );

  const colorFilter = useCallback(
    (bool: boolean, value: string) => {
      const params = new URLSearchParams(searchParams);
      if (bool) {
        params.set("color", value);
      } else {
        params.delete("color");
      }
      return params;
    },
    [searchParams]
  );

  const priceFilter = useCallback(
    (value: number) => {
      const params = new URLSearchParams(searchParams);
      params.set("price", String(value));
      return params;
    },
    [searchParams]
  );

  const activeFiltersCount = [
    searchParams.get("size"),
    searchParams.get("color"),
    searchParams.get("price"),
  ].filter(Boolean).length;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1">
        <div className="p-4 space-y-6">
          {/* Active Filters Summary */}
          {activeFiltersCount > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Active Filters
                </h3>
                <Badge variant="secondary" className="text-xs">
                  {activeFiltersCount}
                </Badge>
              </div>
              <Separator />
            </div>
          )}

          <Accordion type="multiple" className="space-y-4">
            {/* Size Filter */}
            <AccordionItem
              value="size"
              className="border rounded-xl bg-card/50"
            >
              <AccordionTrigger className="hover:no-underline px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Ruler className="w-4 h-4 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Size</div>
                    <div className="text-sm text-muted-foreground">
                      Choose your fit
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-3 pt-2">
                  {sizes.map((size) => (
                    <div
                      key={size.value}
                      className="flex items-center justify-between p-3 rounded-lg bg-background border hover:bg-accent/50 transition-colors"
                    >
                      <h4 className="font-medium">{size.label}</h4>
                      <Switch
                        checked={searchParams.get("size") === size.value}
                        onCheckedChange={(e) => {
                          const params = sizeFilter(e, size.value);
                          router.replace(`/${category}?${params.toString()}`);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Color Filter */}
            <AccordionItem
              value="color"
              className="border rounded-xl bg-card/50"
            >
              <AccordionTrigger className="hover:no-underline px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Palette className="w-4 h-4 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Colors</div>
                    <div className="text-sm text-muted-foreground">
                      Pick your style
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-3 pt-2">
                  {colors.map((color) => (
                    <div
                      key={color.value}
                      className="flex items-center justify-between p-3 rounded-lg bg-background border hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border-2 border-border ${color.color}`}
                        />
                        <h4 className="font-medium">{color.label}</h4>
                      </div>
                      <Switch
                        checked={searchParams.get("color") === color.value}
                        onCheckedChange={(bool) => {
                          const params = colorFilter(bool, color.value);
                          router.replace(`/${category}?${params.toString()}`);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Price Filter */}
            <AccordionItem
              value="price"
              className="border rounded-xl bg-card/50"
            >
              <AccordionTrigger className="hover:no-underline px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <DollarSign className="w-4 h-4 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Price Range</div>
                    <div className="text-sm text-muted-foreground">
                      Set your budget
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-4 pt-2">
                  <div className="p-4 rounded-lg bg-background border">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm font-medium">Maximum Price</span>
                      <Badge variant="outline" className="font-mono">
                        ₹{searchParams.get("price") || "4000"}
                      </Badge>
                    </div>
                    <Slider
                      min={1000}
                      max={4000}
                      step={250}
                      defaultValue={[
                        Number.parseInt(searchParams.get("price") || "4000"),
                        4000,
                      ]}
                      onValueChange={(value) => {
                        const params = priceFilter(value[0]);
                        router.replace(`/${category}?${params.toString()}`);
                      }}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>₹1,000</span>
                      <span>₹4,000</span>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}

export default function ModernFilter({ category }: ModernFilterProps) {
  const isMobile = useIsMobile();
  const trigger = (
    <Button variant="outline">
      <SlidersHorizontal className="w-4 h-4" />
      Filter
    </Button>
  );

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        <DrawerContent className="max-h-[85vh] p-0 flex flex-col">
          <DrawerHeader className="border-b">
            <DrawerTitle className="flex items-center gap-2 text-lg">
              <SlidersHorizontal className="w-5 h-5 text-primary" />
              Filter & Sort
            </DrawerTitle>
          </DrawerHeader>
          <div className="overflow-y-auto px-4 py-2">
            <FilterContent category={category} />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className="overflow-y-auto p-0 backdrop-blur-sm">
        <SheetHeader className="border-b bg-card/50 p-6">
          <SheetTitle className="flex items-center gap-2 text-lg">
            <SlidersHorizontal className="w-5 h-5 text-primary" />
            Filter & Sort
          </SheetTitle>
        </SheetHeader>
        <FilterContent category={category} />
      </SheetContent>
    </Sheet>
  );
}
