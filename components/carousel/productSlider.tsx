"use client";

import React, { useCallback, useEffect } from "react";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { Product } from "@prisma/client";

type PropType = {
  product: Product;
  options?: EmblaOptionsType;
};
const ProductSlider: React.FC<PropType> = (props) => {
  const { product, options } = props;

  const [emblaMainRef, emblaMainApi] = useEmblaCarousel(options);
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: "trimSnaps",
    dragFree: false,
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
    <div className="embla ">
      <div className="embla__viewport" ref={emblaMainRef}>
        <div className="embla__container">
          {images.map((image, index) => (
            <div className="embla__slide" key={index}>
              <Image
                src={image}
                height={1350}
                width={1080}
                alt="Carousel Image"
                priority
                placeholder="blur"
                blurDataURL={
                  placeholderImages[index] ??
                  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAAECAIAAADETxJQAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAM0lEQVR4nAEoANf/ALGzrLi+t7a+tgDOzsiViYOaioYAyZ6bNAAApVZXAPbx8PTz8/39+9MaGEV/cIIyAAAAAElFTkSuQmCC"
                }
                className="md:rounded-lg object-cover aspect-[9-16] cursor-grab"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="embla-thumbs container md:p-0 overflow-hidden">
        <div className="embla-thumbs__viewport" ref={emblaThumbsRef}>
          <div className="embla-thumbs__container flex gap-4">
            {images.map((image, index) => (
              <Image
                key={index}
                onClick={() => onThumbClick(index)}
                src={image}
                height={100}
                width={100}
                alt="Carousel Image"
                priority
                placeholder="blur"
                blurDataURL={
                  placeholderImages[index] ??
                  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAAECAIAAADETxJQAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAM0lEQVR4nAEoANf/ALGzrLi+t7a+tgDOzsiViYOaioYAyZ6bNAAApVZXAPbx8PTz8/39+9MaGEV/cIIyAAAAAElFTkSuQmCC"
                }
                className="rounded-sm object-cover aspect-square cursor-pointer"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSlider;
