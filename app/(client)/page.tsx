import Footer from "@/components/footer/footer";
// import PreLoader from "@/components/preloader";
import OurCollection from "@/components/carousel/ourCollection";
import HeroImages from "@/components/heroImages";
import CookieConsentBar from "@/components/CookieConsent";

export default async function HomePage() {
  return (
    <main className="flex-1">
      {/* <PreLoader /> */}
      <HeroImages />
      <OurCollection />
      {/* <Footer /> */}
      {/* <Banner /> */}
      <CookieConsentBar />
    </main>
  );
}
