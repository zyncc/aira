"use client";

import Image from "next/image";
import Link from "next/link";
import formatCurrency from "@/lib/formatCurrency";
import { capitalizeFirstLetter } from "@/lib/caplitaliseFirstLetter";

type CardProps = {
  image: string;
  title: string;
  category: string;
  placeholder: string;
  color: string;
  id: string;
  price: number;
};

const ProductCard = ({
  image,
  title,
  price,
  placeholder,
  id,
  color,
  category,
}: CardProps) => {
  const formatted = formatCurrency(price);
  return (
    <div className="group relative flex-1 w-full overflow-hidden">
      <div className="aspect-9/16 overflow-hidden rounded-lg bg-background">
        <Link
          aria-label="navigation-link"
          prefetch={false}
          href={`/${category}/${id}`}
        >
          <Image
            src={image}
            alt="Product Image"
            placeholder="blur"
            priority
            quality={90}
            fetchPriority="high"
            blurDataURL={placeholder}
            width={300}
            height={300}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <Link aria-label="navigation-link" href={`/${category}/${id}`}>
            <p className="text-sm font-medium line-clamp-1">{title}</p>
          </Link>
          <p className="mt-1 text-sm text-foreground">
            {capitalizeFirstLetter(color)}
          </p>
        </div>
        <p className="text-base font-semibold">{formatted.split(".")[0]}</p>
      </div>
    </div>
  );
};

export default ProductCard;
