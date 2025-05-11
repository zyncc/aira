//@ts-nocheck
"use client";

import React from "react";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Product } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";
import formatCurrency from "@/lib/formatCurrency";

export default function SimilarProductsCarousel({
  similarProducts,
}: {
  similarProducts: Product[];
}) {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: false,
      }}
      plugins={[
        Autoplay({
          delay: 3000,
          stopOnFocusIn: false,
        }),
      ]}
      className="w-full"
    >
      <CarouselContent>
        {similarProducts.map((product) => (
          <CarouselItem
            key={product.id}
            className="basis-1/2 md:basis-1/3 lg:basis-1/4"
          >
            <Card className="overflow-hidden rounded-tl-lg rounded-tr-lg">
              <CardContent className="p-0">
                <Link
                  href={`/${product.category.replaceAll(" ", "-")}/${product.id}`}
                >
                  <div className="aspect-[2/3] relative overflow-hidden group">
                    <Image
                      src={product.images[0]}
                      alt={product.title}
                      fill
                      priority
                      placeholder="blur"
                      blurDataURL={product.placeholderImages[0]}
                      className="object-cover transition-transform group-hover:scale-105 rounded-tl-lg rounded-tr-lg"
                    />
                  </div>
                  <div className="p-4 bg-background">
                    <h3 className="font-medium line-clamp-1 text-primary">
                      {product.title}
                    </h3>
                    <p className="text-sm text-primary whitespace-nowrap font-medium">
                      Rs. {formatCurrency(product.price)}
                    </p>
                  </div>
                </Link>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
