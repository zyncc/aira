import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import formatCurrency from "@/lib/formatCurrency";
import { Product } from "@prisma/client";

export default async function SimilarProducts({
  similarProducts,
}: {
  similarProducts: Product[];
}) {
  //   await new Promise<void>(
  //     (resolve) =>
  //       setTimeout(() => {
  //         resolve();
  //       }, 300000) // Simulates a 3-second delay
  //   );
  return (
    <div>
      {similarProducts.length > 0 && (
        <div className="container mx-auto mt-10">
          <h2 className="text-2xl font-semibold mb-8">Similar Products</h2>
          <Carousel
            opts={{
              align: "start",
              loop: false,
            }}
            className="w-full"
          >
            <CarouselContent>
              {similarProducts.map((product) => (
                <CarouselItem
                  key={product.id}
                  className="md:basis-1/2 lg:basis-1/3"
                >
                  <Card className="overflow-hidden rounded-tl-lg rounded-tr-lg">
                    <CardContent className="p-0">
                      <Link href={`/products/${product.id}`}>
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
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      )}
    </div>
  );
}
