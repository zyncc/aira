import React, {cache, Suspense} from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import prisma from "@/lib/prisma";
import {Metadata} from "next";
import ProductSlider from "@/components/carousel/productSlider";
import RightPage from "./components/rightPage";
import Reviews from "./components/reviews";
import {notFound} from "next/navigation";
import Footer from "@/components/footer/footer";
import ReviewsSkeleton from "@/components/skeletons/Reviews";
import SimilarProductsSkeleton from "@/components/skeletons/SimilarProducts";
import SimilarProducts from "./components/SimilarProducts";
import {capitalizeFirstLetter} from "@/lib/caplitaliseFirstLetter";
import GoogleOneTap from "@/components/googleOneTap/GoogleOneTap";
// import type { Product } from "schema-dts";
import {getServerSession} from "@/lib/getServerSession";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

const getProduct = cache(async (id: string) => {
  try {
    return await prisma.product.findUnique({
      where: {
        id,
        isArchived: false,
      },
      include: {
        quantity: true,
        reviews: {
          take: 4,
          select: {
            id: true,
          },
        },
      },
    });
  } catch (error) {
    console.log(error);
  }
});

const ProductById = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const session = await getServerSession();
  const product = await getProduct(id);
  if (!product?.title) {
    notFound();
  }
  const StructuredProductSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    brand: {
      "@type": "Brand",
      name: "Aira Clothing",
    },
    name: product.title,
    category: product.category,
    image: product.images,
    description: product.description,
    color: product.color,
    sku: product.id,
    keywords: [`${product.title}`, `${product.category}`, `${product.color}`],
    material: "Cotton Linen",
    audience: {
      "@type": "PeopleAudience",
      requiredGender: "Female",
    },
    offers: {
      "@type": "Offer",
      url: `https://airaclothing.in/${product.category.replaceAll(" ", "-")}/${product.id}`,
      priceCurrency: "INR",
      price: product.price,
      availability: "https://schema.org/InStock",
      priceValidUntil: "2035-11-20",
      acceptedPaymentMethod: "UPI/Card",
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "0",
          currency: "INR",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "IN",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 3,
            maxValue: 5,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 2,
            unitCode: "DAY",
          },
        },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        itemCondition: "https://schema.org/NewCondition",
        refundType: "https://schema.org/StoreCreditRefund",
        merchantReturnDays: 4,
        applicableCountry: "india",
        returnMethod: "https://schema.org/ReturnByMail",
      },
    },
    ...(product.reviews.length > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.5",
        reviewCount: product.reviews.length,
      },
    }),
  };

  const { title } = product;
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(StructuredProductSchema),
        }}
      />
      <section className="max-[768px]:pt-[0px] py-[30px]">
        <Breadcrumb className="container hidden md:block">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink className="text-primary/50 font-medium" href="/">
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                className="text-primary/50 font-medium"
                href={`/${product.category}`}
              >
                {capitalizeFirstLetter(product.category)}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-medium text-primary">
                {title}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex md:mt-[30px] flex-wrap md:flex-nowrap gap-5 md:container">
          <div className="md:basis-1/2">
            <ProductSlider product={product} />
          </div>
          <RightPage product={product} />
        </div>
        <Suspense fallback={<SimilarProductsSkeleton />}>
          <SimilarProducts product={product} />
        </Suspense>
        <Suspense fallback={<ReviewsSkeleton />}>
          <Reviews id={id} category={product.category} />
        </Suspense>
      </section>
      {!session && <GoogleOneTap />}
      <Footer />
    </>
  );
};

export default ProductById;

export async function generateMetadata(props: Params): Promise<Metadata> {
  const params = await props.params;
  const { id } = params;
  const product = await getProduct(id);
  if (!product?.title) {
    return {
      title: "Product does not Exist",
    };
  }
  return {
    title: `${product.title}`,
    description: product.description,
    openGraph: {
      images: [
        {
          url: product.images[0],
          width: 1080,
          height: 1350,
          alt: product.title,
        },
        {
          url: product.images[1],
          width: 1080,
          height: 1350,
          alt: product.title,
        },
        {
          url: product.images[2],
          width: 1080,
          height: 1350,
          alt: product.title,
        },
      ],
    },
  };
}
