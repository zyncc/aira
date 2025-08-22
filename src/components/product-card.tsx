import { convertImage } from "@/lib/convert-image";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "./ui/card";

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

const ProductCard = ({ image, title, price, placeholder, id, category }: CardProps) => {
  const formatted = formatCurrency(price);
  const categoryPath = category.replaceAll(" ", "-").toLowerCase();

  return (
    <Card className="relative overflow-hidden border-none p-0 max-md:rounded-none max-sm:border max-sm:border-black/10 max-sm:shadow-none">
      <CardContent className="p-0">
        <div className="overflow-hidden">
          <Link
            prefetch={false}
            aria-label={`View ${title}`}
            href={`/${categoryPath}/${id}`}
          >
            <div className="relative aspect-[2/3] w-full">
              <Image
                src={convertImage(image)}
                alt={title}
                placeholder="blur"
                priority
                fetchPriority="high"
                blurDataURL={placeholder}
                fill
                className="object-cover transition-all duration-500 group-focus-visible:scale-105"
              />
            </div>
          </Link>
        </div>
        <div className="p-3">
          <Link aria-label={`View ${title}`} href={`/${categoryPath}/${id}`}>
            <h3 className="line-clamp-1 font-medium decoration-1 max-sm:text-sm">
              {title}
            </h3>
          </Link>
          <div className="mt-0">
            <p className="text-sm font-semibold">Rs. {formatted}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
