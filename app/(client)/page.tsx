import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Footer from "@/components/footer/footer";
import { ArrowRight } from "lucide-react";
import hero1 from "@/public/hero1.jpg";
import hero2 from "@/public/hero2.jpg";
import hero3 from "@/public/hero3.jpg";
import hero4 from "@/public/hero4.jpg";
import FeaturedProducts from "@/components/carousel/featuredProducts";
import RecentProducts from "@/components/carousel/recentProducts";
import HeroBannerCarousel from "@/components/carousel/heroBannerCarousel";
import { FeaturedAndRecentProducts } from "@/lib/types";

const heroItems = [
  {
    title: "Men Suits",
    image: hero2,
    link: "/men",
  },
  {
    title: "Women",
    image: hero1,
    link: "/resort-wear",
  },
];

export default async function HomePage() {
  try {
    const [featuredProductsRes, recentProductsRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cached/featuredProducts`, {
        next: {
          revalidate: 86400,
          tags: ["featuredProduct", "createdNewProduct"],
        },
      }),
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cached/recentProducts`, {
        next: {
          revalidate: 86400,
          tags: ["recentProducts", "createdNewProduct"],
        },
      }),
    ]);

    const featuredProducts: FeaturedAndRecentProducts[] =
      await featuredProductsRes.json();
    const recentProducts: FeaturedAndRecentProducts[] =
      await recentProductsRes.json();

    return (
      <main className="flex-1">
        <section className="hidden md:grid grid-cols-2 h-[100vh] w-full">
          {heroItems.map((item, index) => (
            <Link
              key={index}
              href={item.link}
              className="relative group overflow-hidden"
            >
              <div className="relative w-full h-full group">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  quality={90}
                  placeholder="blur"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-black/20 transition-opacity duration-500"></div>
              </div>
              <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-black/20 to-transparent">
                <h2 className="text-2xl font-light text-white mb-4">
                  {item.title}
                </h2>
                <Button
                  variant="outline"
                  className="w-fit bg-white backdrop-blur-sm hover:bg-white"
                >
                  See product
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Link>
          ))}
        </section>
        <HeroBannerCarousel heroItems={heroItems} />
        {/* Featured Products Section */}
        <section className="py-16 px-4">
          <div className="lg:container lg:mx-auto">
            <h2 className="text-2xl font-medium mb-8">Featured Products</h2>
            <FeaturedProducts featuredProducts={featuredProducts} />
          </div>
        </section>
        {/* Recently Added Section */}
        <section className="pb-16 px-4">
          <div className="lg:container lg:mx-auto">
            <h2 className="text-2xl font-medium mb-8">Recently Added</h2>
            <RecentProducts recentProducts={recentProducts} />
          </div>
        </section>
        {/* Categories Grid */}
        <section className="pb-16 px-4">
          <div className="lg:container lg:mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Link href="/party-wear" className="relative aspect-[4/5] group">
                <Image
                  src={hero4}
                  alt="Women's Collection"
                  fill
                  className="object-cover rounded-lg"
                  placeholder="blur"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors rounded-lg">
                  <div className="h-full flex items-center justify-center">
                    <h3 className="text-white text-3xl font-light">Women</h3>
                  </div>
                </div>
              </Link>
              <Link href="/men" className="relative aspect-[4/5] group">
                <Image
                  src={hero3}
                  alt="Men's Collection"
                  fill
                  className="object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors rounded-lg">
                  <div className="h-full flex items-center justify-center">
                    <h3 className="text-white text-3xl font-light">Men</h3>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>
        <Footer />
        {/* <Banner /> */}
      </main>
    );
  } catch (error) {
    console.log(error);
    return <></>;
  }
}
