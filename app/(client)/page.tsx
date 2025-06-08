import Footer from "@/components/footer/footer";
// import PreLoader from "@/components/preloader";
import OurCollection from "@/components/carousel/ourCollection";
import HeroImages from "@/components/heroImages";

export default async function HomePage() {
  // const [featuredProductsRes, recentProductsRes] = await Promise.all([
  //   fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cached/featuredProducts`, {
  //     next: {
  //       revalidate: 86400,
  //       tags: ["featuredProduct", "createdNewProduct"],
  //     },
  //   }),
  //   fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cached/recentProducts`, {
  //     next: {
  //       revalidate: 86400,
  //       tags: ["recentProducts", "createdNewProduct"],
  //     },
  //   }),
  // ]);

  // const featuredProducts: FeaturedAndRecentProducts[] =
  //   await featuredProductsRes.json();
  // const recentProducts: FeaturedAndRecentProducts[] =
  //   await recentProductsRes.json();

  return (
    <main className="flex-1">
      {/* <PreLoader /> */}
      <HeroImages />
      <OurCollection />
      <Footer />
      {/* <Banner /> */}
    </main>
  );
}
