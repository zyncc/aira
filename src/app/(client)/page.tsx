import Image from "next/image";
import heroDesktop from "../../../public/hero-desktop.jpg";
import heroMobile from "../../../public/hero-mobile.jpg";

export default function Home() {
  return (
    <div className="flex h-[500vh] w-screen items-start justify-center">
      <div className="relative h-screen w-screen">
        <Image
          src={heroDesktop}
          className="object-cover max-lg:hidden"
          fill
          alt="Hero Image"
          priority
          quality={100}
          fetchPriority="high"
          placeholder="blur"
        />
        <Image
          src={heroMobile}
          className="object-cover lg:hidden"
          fill
          alt="Hero Image"
          priority
          quality={100}
          fetchPriority="high"
          placeholder="blur"
        />
      </div>
    </div>
  );
}
