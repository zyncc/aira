"use client";

import Image from "next/image";
import Link from "next/link";
import full from "@/public/full.jpg";
import mobileFull from "@/public/full-mobile.jpeg";
import { Button } from "../ui/button";
import { HeartHandshake, Package } from "lucide-react";
import { RiExchangeLine } from "react-icons/ri";
import { RiCustomerServiceLine } from "react-icons/ri";
import { CiCreditCard1 } from "react-icons/ci";
import aboutus from "@/public/aboutus.jpeg";
import { useIsMobile } from "@/hooks/use-mobile";

interface GalleryImage {
  src: string;
  alt: string;
  title: string;
  href: string;
}

const galleryImages: GalleryImage[] = [
  {
    src: "https://res.cloudinary.com/dfdusmp26/image/upload/v1752484192/Products/rl9n28pqooabzfb5akj4.jpg",
    alt: "Collection 1",
    title: "CO-ORD SET",
    href: "/co-ord-set",
  },
  {
    src: "https://res.cloudinary.com/dfdusmp26/image/upload/v1752723182/Products/xepuzogcejfw4h3wrdvu.jpg",
    alt: "Collection 2",
    title: "Dresses",
    href: "/dresses",
  },
  {
    src: "https://res.cloudinary.com/dfdusmp26/image/upload/v1752723182/Products/xepuzogcejfw4h3wrdvu.jpg",
    alt: "Collection 3",
    title: "Dresses",
    href: "/dresses",
  },
  {
    src: "https://res.cloudinary.com/dfdusmp26/image/upload/v1752723182/Products/xepuzogcejfw4h3wrdvu.jpg",
    alt: "Collection 4",
    title: "Dresses",
    href: "/dresses",
  },
];

const features = [
  {
    icon: <Package className="text-primary" size={40} />,
    title: "Free Shipping",
    description: "On all orders",
  },
  {
    icon: <RiExchangeLine className="text-primary" size={40} />,
    title: "4 Days Exchange",
    description: "Easy Exchange",
  },
  {
    icon: <RiCustomerServiceLine className="text-primary" size={40} />,
    title: "Easy Customer Care",
    description: "Available 24/7",
  },
  {
    icon: <CiCreditCard1 className="text-primary" size={40} />,
    title: "Secure Payments",
    description: "Multiple options available",
  },
];

export default function OurCollection() {
  const isMobile = useIsMobile(639);
  return (
    <>
      <div className="py-10 px-2 lg:px-10">
        <h2 className="font-bold text-xl md:text-3xl text-center mb-5 text-primary">
          OUR COLLECTION
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 overflow-x-auto">
          {galleryImages.map((image) => (
            <Link key={image.alt} href={image.href} className="relative group">
              <Image
                src={image.src}
                alt={image.alt}
                className="select-none w-full h-auto object-cover"
                height={500}
                width={400}
                priority
                fetchPriority="high"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 opacity-100 transition-opacity duration-500 flex items-center justify-center">
                <h3 className="text-white text-base md:text-lg font-semibold">
                  {image.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="w-full">
        <Image
          src={isMobile ? mobileFull : full}
          alt="Full"
          height={1000}
          width={1000}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="py-10 px-2 lg:px-10 min-h-[100vh]">
        <h2 className="font-bold uppercase text-xl md:text-3xl text-center mb-5 text-primary">
          Watch <span className="mx-2">&</span> Buy
        </h2>
      </div>
      <div className=" container mx-auto py-10 px-2 lg:px-10">
        <div className="flex flex-col md:flex-row">
          <div className="basis-3/4">
            <h2 className="font-bold text-left uppercase text-primary text-xl md:text-3xl">
              About us
            </h2>
            <h5 className="text-sm  mb-5  text-primary">
              Our story, Our promise.
            </h5>
            <p className="max-w-4xl text-primary">
              Founded in 2025, Aira is your proudly home-grown destination for
              effortlessly stylish and surprisingly affordable fashion. From
              laid-back weekend casuals and eye-catching party looks to
              sun-ready resort pieces, polished office separates and
              wardrobe-essential staples, every collection is thoughtfully
              crafted to blend luxe touches with sustainable practices. Discover
              your new favorite outfits and feel confident wherever life takes
              you—Aira makes looking and feeling good with comfort that’s as
              easy as breathing. Our story Born out of a love for fashion and a
              desire to make a statement, Aira was founded on the principles of
              creativity, uniqueness, and customer satisfaction. Our team of
              designers, artisans, and enthusiasts work tirelessly to bring you
              the latest trends, timeless classics, and everything in between.
            </p>
            <Link href={"/about"}>
              <Button
                variant={"outline"}
                className="rounded-none hover:bg-background hover:text-accent border-2 border-accent text-accent my-5"
              >
                Know more
              </Button>
            </Link>
          </div>
          <Image
            src={aboutus}
            alt="aboutus"
            fetchPriority="low"
            placeholder="blur"
            width={400}
            height={500}
            className="object-cover"
          />
        </div>
      </div>
      <div className="flex items-center justify-center text-primary">
        <div className="flex items-center flex-col md:flex-row text-center md:text-left gap-2 p-5  rounded-lg mb-2">
          <HeartHandshake size={40} />
          <div>
            <h3 className="font-semibold">By Women, For Women</h3>
            <p className="text-xs md:text-sm">Every Design with intention</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 container md:grid-cols-4 gap-2 md:gap-4 mb-10">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="flex items-center flex-col md:flex-row text-center md:text-left gap-2 p-2 text-primary rounded-lg"
          >
            {feature.icon}
            <div>
              <h3 className="font-semibold text-sm md:text-base">
                {feature.title}
              </h3>
              <p className="text-xs md:text-sm">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
