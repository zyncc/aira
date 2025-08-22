import { Product } from "./types";
import { extractDescription } from "./utils";

export const states = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

export function GetProductSchema(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    brand: {
      "@type": "Brand",
      name: "Aira Clothing",
    },
    name: product.title,
    category: product.category,
    image: product.images,
    description: extractDescription(product.description),
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
    // ...(product.reviews.length > 0 && {
    //   aggregateRating: {
    //     "@type": "AggregateRating",
    //     ratingValue: "4.5",
    //     reviewCount: product.reviews.length,
    //   },
    // }),
  };
}
