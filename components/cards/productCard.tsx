"use client";

import Image from "next/image";
import Link from "next/link";
import formatCurrency from "@/lib/formatCurrency";
import { getCloudinaryImageUrl } from "@/lib/getCloudinaryThumbnailUrl";

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
    <div className="group relative w-full overflow-hidden rounded-none bg-background transition-all duration-300 border border-black/10">
      <div className="overflow-hidden">
        <Link
          aria-label={`View ${title}`}
          prefetch={false}
          href={`/${categoryPath}/${id}`}
          className="block w-full"
        >
          <div className="relative aspect-[2/3] w-full">
            <Image
              src={getCloudinaryImageUrl(image)}
              alt={title}
              placeholder="blur"
              priority
              fetchPriority="high"
              blurDataURL={placeholder}
              loading="lazy"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-all duration-500 group-hover:scale-105"
            />
          </div>
        </Link>
      </div>
      <div className="p-3">
        <Link aria-label={`View ${title}`} href={`/${categoryPath}/${id}`}>
          <h3 className="line-clamp-1 font-medium max-sm:text-sm decoration-1">
            {title}
          </h3>
        </Link>
        <div className="mt-0">
          <p className="font-semibold text-sm">Rs. {formatted}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
