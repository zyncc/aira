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
    <Card className="group relative overflow-hidden rounded-none border border-none border-black/10 p-0 shadow-none">
      <CardContent className="p-0">
        <div className="overflow-hidden">
          <Link
            aria-label={`View ${title}`}
            prefetch={false}
            href={`/${categoryPath}/${id}`}
          >
            <div className="relative aspect-[2/3] w-full">
              <Image
                src={convertImage(image, 800)}
                alt={title}
                placeholder="blur"
                priority
                fetchPriority="high"
                blurDataURL={placeholder}
                fill
                className="object-cover transition-all duration-500 group-hover:scale-105"
              />
            </div>
          </Link>
        </div>
        <div className="p-1.5 md:p-3 md:pl-0">
          <Link aria-label={`View ${title}`} href={`/${categoryPath}/${id}`}>
            <h3 className="line-clamp-1 text-sm font-medium">{title}</h3>
          </Link>
          <div className="mt-0">
            <p className="text-sm">Rs. {formatted}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
