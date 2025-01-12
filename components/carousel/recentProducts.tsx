//@ts-nocheck
"use client";

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

export default function RecentProducts({
  recentProducts,
}: {
  recentProducts: Product[];
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
        {recentProducts.map((product) => (
          <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3">
            <Card className="overflow-hidden rounded-tl-lg rounded-tr-lg">
              <CardContent className="p-0">
                <Link href={`/${product.category}/${product.id}`}>
                  <div className="aspect-square relative overflow-hidden group">
                    <Image
                      src={product.images[0]}
                      alt={product.title}
                      fill
                      // placeholder="blur"
                      // blurDataURL={product.placeholderImages[0]}
                      className="object-cover transition-transform group-hover:scale-105 rounded-tl-lg rounded-tr-lg"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium">{product.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(product.price).split(".")[0]}
                    </p>
                  </div>
                </Link>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
