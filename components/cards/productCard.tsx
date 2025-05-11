"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import formatCurrency from "@/lib/formatCurrency";

type CardProps = {
  image: string;
  title: string;
  category: string;
  placeholder: string;
  color: string;
  id: string;
  price: number;
  isNew?: boolean;
  isSale?: boolean;
  rating?: number;
};

const ProductCard = ({
  image,
  title,
  price,
  placeholder,
  id,
  category,
}: CardProps) => {
  const formatted = formatCurrency(price);
  const categoryPath = category.replaceAll(" ", "-").toLowerCase();

  return (
    <div className="group relative w-full overflow-hidden rounded-xl bg-background transition-all duration-300 shadow-md">
      <button
        className="absolute right-3 top-3 z-10 rounded-full bg-white p-2 backdrop-blur-sm transition-all hover:bg-white"
        aria-label="Add to wishlist"
      >
        <Heart className="h-4 w-4 text-primary" />
      </button>
      <div className="overflow-hidden bg-gray-50">
        <Link
          aria-label={`View ${title}`}
          prefetch={false}
          href={`/${categoryPath}/${id}`}
          className="block w-full"
        >
          <div className="relative aspect-[2/3] w-full">
            <Image
              src={image || "/placeholder.svg"}
              alt={title}
              placeholder="blur"
              priority
              quality={95}
              fetchPriority="high"
              blurDataURL={placeholder}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-all duration-500 group-hover:scale-105"
            />
          </div>
        </Link>
      </div>
      <div className="p-4">
        <Link aria-label={`View ${title}`} href={`/${categoryPath}/${id}`}>
          <h3 className="line-clamp-1 font-medium text-primary group-hover:underline decoration-1 underline-offset-2">
            {title}
          </h3>
        </Link>
        <div className="mt-2">
          <p className="font-semibold text-primary">Rs. {formatted}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
