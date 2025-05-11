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
import Link from "next/link";
import Image from "next/image";
import formatCurrency from "@/lib/formatCurrency";
import { FeaturedAndRecentProducts } from "@/lib/types";

export default function FeaturedProducts({
  featuredProducts,
}: {
  featuredProducts: FeaturedAndRecentProducts[];
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
        {featuredProducts.map((product) => (
          <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3">
            <Card className="overflow-hidden rounded-tl-lg rounded-tr-lg">
              <CardContent className="p-0">
                <Link
                  href={`/${product.category.replaceAll(" ", "-")}/${product.id}`}
                >
                  <div className="aspect-square relative overflow-hidden group">
                    <Image
                      src={product.images[0]}
                      alt={product.title}
                      fill
                      placeholder="blur"
                      blurDataURL={product.placeholderImages[0]}
                      className="object-cover transition-transform group-hover:scale-105 rounded-tl-lg rounded-tr-lg"
                    />
                  </div>
                  <div className="p-4 bg-background">
                    <h3 className="font-medium">{product.title}</h3>
                    <p className="text-sm text-foreground">
                      Rs. {formatCurrency(product.price)}
                    </p>
                  </div>
                </Link>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden md:block" />
      <CarouselNext className="hidden md:block" />
    </Carousel>
  );
}
