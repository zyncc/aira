"use client";

import React, { useCallback, useEffect } from "react";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { Product } from "@prisma/client";
import { useIsMobile } from "@/hooks/use-mobile";

type PropType = {
  product: Product;
  options?: EmblaOptionsType;
};
const ProductSlider: React.FC<PropType> = (props) => {
  const { product } = props;
  const isMobile = useIsMobile();
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel();
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
    [emblaMainApi, emblaThumbsApi]
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
    <div className="embla flex flex-col lg:flex-row lg:items-start">
      <div
        className="embla__viewport lg:order-2 md:rounded-lg"
        ref={emblaMainRef}
      >
        <div className="embla__container md:rounded-lg">
          {images.map((image, index) => (
            <div className="embla__slide md:rounded-lg" key={index}>
              <Image
                src={image}
                height={2100}
                width={1400}
                alt="Carousel Image"
                priority
                fetchPriority="high"
                placeholder="blur"
                blurDataURL={placeholderImages[index]}
                className="md:rounded-lg object-cover aspect-[2-3] cursor-grab"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="embla-thumbs lg:w-fit max-lg:mt-2 lg:order-1 container max-lg:overflow-x-hidden">
        <div className="embla-thumbs__viewport" ref={emblaThumbsRef}>
          <div className="embla-thumbs__container lg:w-[70px] flex lg:flex-col gap-2">
            {images.map((image, index) => (
              <Image
                key={index}
                onClick={() => onThumbClick(index)}
                src={image}
                height={70}
                width={70}
                alt="Carousel Image"
                priority
                fetchPriority="high"
                placeholder="blur"
                blurDataURL={placeholderImages[index]}
                className="rounded-md object-cover aspect-square cursor-pointer object-top"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSlider;
