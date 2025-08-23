"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";
import sizechart from "../../../../../../public/sizechart.jpg";

type Props = {
  product: Product;
};

export default function RightPage({ product }: Props) {
  const { title, price } = product;
  const formatted = formatCurrency(price);

  return (
    <div className="flex flex-col gap-3 md:basis-1/2">
      <div className="">
        <div className="flex items-center justify-between">
          <h1 className="text-primary mr-3 line-clamp-1 text-xl font-medium uppercase">
            {title}
          </h1>
        </div>
        <h2 className="text-primary mt-1 font-medium">Rs. {formatted}</h2>
      </div>
      <div className="mb-2 flex w-full items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Select Size</h3>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="link"
              className="text-muted-foreground h-auto p-0 text-sm underline"
              size="sm"
            >
              Size Guide
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-lg">
            <DialogHeader>
              <DialogTitle className="text-primary text-center text-xl">
                Size Chart
              </DialogTitle>
            </DialogHeader>
            <div className="">
              <Image
                src={sizechart}
                className="object-cover"
                width={1000}
                height={1000}
                placeholder="blur"
                alt="Size chart showing measurements for different sizes"
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
