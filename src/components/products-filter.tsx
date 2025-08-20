"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useIsMobile } from "@/hooks/use-mobile";
import { DollarSign, Palette, Ruler, SlidersHorizontal } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

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
    [searchParams],
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
    [searchParams],
  );

  const priceFilter = useCallback(
    (value: number) => {
      const params = new URLSearchParams(searchParams);
      params.set("price", String(value));
      return params;
    },
    [searchParams],
  );

  const activeFiltersCount = [
    searchParams.get("size"),
    searchParams.get("color"),
    searchParams.get("price"),
  ].filter(Boolean).length;

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1">
        <div className="space-y-6 p-4">
          {/* Active Filters Summary */}
          {activeFiltersCount > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-muted-foreground text-sm font-medium">
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
            <AccordionItem value="size" className="bg-card/50 rounded-xl border">
              <AccordionTrigger className="px-4 py-4 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 rounded-lg p-2">
                    <Ruler className="text-primary h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Size</div>
                    <div className="text-muted-foreground text-sm">Choose your fit</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-3 pt-2">
                  {sizes.map((size) => (
                    <div
                      key={size.value}
                      className="bg-background hover:bg-accent/50 flex items-center justify-between rounded-lg border p-3 transition-colors"
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
            <AccordionItem value="color" className="bg-card/50 rounded-xl border">
              <AccordionTrigger className="px-4 py-4 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 rounded-lg p-2">
                    <Palette className="text-primary h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Colors</div>
                    <div className="text-muted-foreground text-sm">Pick your style</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-3 pt-2">
                  {colors.map((color) => (
                    <div
                      key={color.value}
                      className="bg-background hover:bg-accent/50 flex items-center justify-between rounded-lg border p-3 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`border-border h-5 w-5 rounded-full border-2 ${color.color}`}
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
            <AccordionItem value="price" className="bg-card/50 rounded-xl border">
              <AccordionTrigger className="px-4 py-4 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 rounded-lg p-2">
                    <DollarSign className="text-primary h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Price Range</div>
                    <div className="text-muted-foreground text-sm">Set your budget</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-4 pt-2">
                  <div className="bg-background rounded-lg border p-4">
                    <div className="mb-4 flex items-center justify-between">
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
                    <div className="text-muted-foreground mt-2 flex justify-between text-xs">
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
      <SlidersHorizontal className="h-4 w-4" />
      Filter
    </Button>
  );

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        <DrawerContent className="flex max-h-[85vh] flex-col p-0">
          <DrawerHeader className="border-b">
            <DrawerTitle className="flex items-center gap-2 text-lg">
              <SlidersHorizontal className="text-primary h-5 w-5" />
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
        <SheetHeader className="bg-card/50 border-b p-6">
          <SheetTitle className="flex items-center gap-2 text-lg">
            <SlidersHorizontal className="text-primary h-5 w-5" />
            Filter & Sort
          </SheetTitle>
        </SheetHeader>
        <FilterContent category={category} />
      </SheetContent>
    </Sheet>
  );
}
