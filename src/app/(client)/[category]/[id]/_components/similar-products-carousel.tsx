"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { convertImage } from "@/lib/convert-image";
import { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";

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
          <CarouselItem key={product.id} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
            <Card className="overflow-hidden rounded-tl-lg rounded-tr-lg p-0">
              <CardContent className="p-0">
                <Link href={`/${product.category.replaceAll(" ", "-")}/${product.id}`}>
                  <div className="relative aspect-[2/3] overflow-hidden">
                    <Image
                      src={convertImage(product.images[0])}
                      alt={product.title}
                      fill
                      loading="lazy"
                      // placeholder="blur"
                      // blurDataURL={product.placeholderImages[0]}
                      className="rounded-tl-lg rounded-tr-lg object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="text-muted-foreground line-clamp-1 font-medium">
                      {product.title}
                    </h3>
                    <p className="text-muted-foreground text-sm font-medium whitespace-nowrap">
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
