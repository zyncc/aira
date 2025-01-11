import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Footer from "@/components/footer/footer";
import { ArrowRight } from "lucide-react";
import prisma from "@/lib/prisma";
import formatCurrency from "@/lib/formatCurrency";
import hero1 from "@/public/hero1.jpg";
import hero2 from "@/public/hero2.jpg";
import hero3 from "@/public/hero3.jpg";
import hero4 from "@/public/hero4.jpg";

export default async function HomePage() {
  const [featuredProducts, recentProducts] = await Promise.all([
    prisma.product.findMany({
      where: {
        isFeatured: true,
        isArchived: false,
      },
      take: 10,
    }),
    prisma.product.findMany({
      where: {
        isFeatured: false,
        isArchived: false,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 4,
    }),
  ]);

  const heroItems = [
    {
      title: "Men Suits",
      image: hero2,
      link: "/men",
    },
    {
      title: "Women",
      image: hero1,
      link: "/pants",
    },
  ];

  return (
    <main className="flex-1">
      <section className="hidden md:grid grid-cols-2 h-[80vh] w-full">
        {heroItems.map((item, index) => (
          <Link
            key={index}
            href={item.link}
            className="relative group overflow-hidden"
          >
            <Image
              src={item.image}
              alt={item.title}
              fill
              placeholder="blur"
              className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-black/20 to-transparent">
              <h2 className="text-2xl font-light text-white mb-4">
                {item.title}
              </h2>
              <Button
                variant="outline"
                className="w-fit bg-white backdrop-blur-sm hover:bg-white"
              >
                See product
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Link>
        ))}
      </section>
      {/* Mobile Layout */}
      <Carousel
        className="md:hidden h-[100vh]"
        opts={{
          loop: false,
        }}
      >
        <CarouselContent>
          {heroItems.map((item, index) => (
            <CarouselItem key={index}>
              <Link href={item.link} className="relative block h-[100vh]">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  placeholder="blur"
                  className="object-cover object-center"
                  priority
                />
                <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <h2 className="text-xl font-medium text-white mb-4">
                    {item.title}
                  </h2>
                  <Button
                    variant="outline"
                    className="w-fit bg-white backdrop-blur-sm hover:bg-white"
                  >
                    See product
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      {/* Featured Products Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-2xl font-medium mb-8">Featured Products</h2>
          <Carousel
            opts={{
              align: "start",
              loop: false,
            }}
            className="w-full"
          >
            <CarouselContent>
              {featuredProducts.map((product) => (
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
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </section>

      {/* Recently Added Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-2xl font-medium mb-8">Recently Added</h2>
          <Carousel
            opts={{
              align: "start",
              loop: false,
            }}
            className="w-full"
          >
            <CarouselContent>
              {recentProducts.map((product) => (
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
      </section>

      {/* Categories Grid */}
      <section className="pb-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link href="/pants" className="relative aspect-[4/5] group">
              <Image
                src={hero4}
                alt="Women's Collection"
                fill
                className="object-cover rounded-lg"
                placeholder="blur"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors rounded-lg">
                <div className="h-full flex items-center justify-center">
                  <h3 className="text-white text-3xl font-light">Women</h3>
                </div>
              </div>
            </Link>
            <Link href="/men" className="relative aspect-[4/5] group">
              <Image
                src={hero3}
                alt="Men's Collection"
                fill
                className="object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors rounded-lg">
                <div className="h-full flex items-center justify-center">
                  <h3 className="text-white text-3xl font-light">Men</h3>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
