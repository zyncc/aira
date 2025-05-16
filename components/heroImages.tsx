"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import hero from "@/public/hero.jpg";
import mobileHero from "@/public/mobile-hero.png";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export default function HeroImages() {
  const isMobile = useMediaQuery("(max-width: 639px)");
  return (
    <div className="w-screen max-h-screen overflow-hidden relative">
      <Image
        src={isMobile ? mobileHero : hero}
        alt="Hero"
        width={isMobile ? 1080 : 1920}
        height={isMobile ? 1920 : 1080}
        placeholder="blur"
        fetchPriority="high"
        priority
        className="w-full h-screen object-cover select-none"
      />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center flex-col">
        <h2 className="lg:text-[40px] text-3xl text-center tracking-tight text-white uppercase">
          Spring/Summer 2025
        </h2>
        <Link href={"/shop-all"}>
          <Button
            className="mt-6 bg-transparent w-fit text-white hover:bg-transparent rounded-none border-2 border-white p-5 text-base uppercase"
            variant={"outline"}
          >
            Shop {"  "} Now
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
