"use client";

import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Link from "next/link";
import Image from "next/image";
import formatCurrency from "@/lib/formatCurrency";
import { FeaturedAndRecentProducts } from "@/lib/types";

export default function RecentProducts({
  recentProducts,
}: {
  recentProducts: FeaturedAndRecentProducts[];
}) {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 3000,
          stopOnMouseEnter: false,
          stopOnLastSnap: false,
          stopOnFocusIn: false,
          stopOnInteraction: false,
        }),
      ]}
      className="w-full"
    >
      <CarouselContent>
        {recentProducts.map((product) => (
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
                      placeholder="blur"
                      blurDataURL={product.placeholderImages[0]}
                      className="object-cover transition-transform group-hover:scale-105 rounded-tl-lg rounded-tr-lg"
                    />
                  </div>
                  <div className="p-4 bg-background">
                    <h3 className="text-sm font-medium line-clamp-1">
                      {product.title}
                    </h3>
                    <p className="text-sm whitespace-nowrap text-foreground">
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
