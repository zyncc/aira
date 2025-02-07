"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

type Props = {
  title: string;
  image: StaticImageData;
  link: string;
}[];

export default function HeroBannerCarousel({
  heroItems,
}: {
  heroItems: Props;
}) {
  return (
    <Carousel
      className="md:hidden h-[100vh]"
      opts={{
        loop: false,
      }}
      plugins={[
        Autoplay({
          delay: 3000,
          stopOnFocusIn: false,
        }),
      ]}
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
  );
}
