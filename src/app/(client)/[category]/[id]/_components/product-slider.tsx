"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { convertImage } from "@/lib/convert-image";
import { Product } from "@/lib/types";
import { EmblaOptionsType } from "embla-carousel";
import AutoHeight from "embla-carousel-auto-height";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import React, { useCallback, useEffect } from "react";

type PropType = {
  product: Product;
  options?: EmblaOptionsType;
};

const ProductSlider: React.FC<PropType> = (props) => {
  const { product } = props;
  const isMobile = useIsMobile(1024);
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel({}, [AutoHeight()]);
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: "trimSnaps",
    dragFree: true,
    active: isMobile ? true : false,
  });

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaMainApi || !emblaThumbsApi) return;
      emblaMainApi.scrollTo(index);
    },
    [emblaMainApi, emblaThumbsApi],
  );

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return;
    emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap());
  }, [emblaMainApi, emblaThumbsApi]);

  useEffect(() => {
    if (!emblaMainApi) return;
    onSelect();
    emblaMainApi.on("select", onSelect);
    emblaMainApi.on("reInit", onSelect);
  }, [emblaMainApi, onSelect]);

  const images = product.images;
  const placeholderImages = product.placeholderImages;

  return (
    <div className="embla flex flex-col gap-x-3 lg:flex-row lg:items-start">
      <div className="embla__viewport md:rounded-lg lg:order-2" ref={emblaMainRef}>
        <div className="embla__container md:rounded-lg">
          {images.map((image, index) => (
            <div className="embla__slide md:rounded-lg" key={index}>
              <Image
                src={convertImage(image, 2500)}
                height={1200}
                width={800}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                alt="Carousel Image"
                priority
                unoptimized
                fetchPriority="high"
                placeholder="blur"
                blurDataURL={placeholderImages[index]}
                className="aspect-[2/3] cursor-grab object-cover md:rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="embla-thumbs pl-2 max-lg:mt-2 max-lg:overflow-x-hidden lg:order-1 lg:w-fit">
        <div className="embla-thumbs__viewport" ref={emblaThumbsRef}>
          <div className="embla-thumbs__container flex gap-2 lg:w-[70px] lg:flex-col">
            {images.map((image, index) => (
              <Image
                key={index}
                onClick={() => onThumbClick(index)}
                src={convertImage(image, 200)}
                height={70}
                width={70}
                unoptimized
                fetchPriority="low"
                alt="Carousel Image"
                placeholder="blur"
                blurDataURL={placeholderImages[index]}
                className="aspect-square cursor-pointer rounded-md object-cover object-top"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSlider;
