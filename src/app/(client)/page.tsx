import { Container } from "@/components/container";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { convertImage } from "@/lib/convert-image";
import { CreditCard, Headphones, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { LuHeartHandshake } from "react-icons/lu";
import hanger from "../../../public/hanger.jpg";
import heroDesktop from "../../../public/hero-desktop.jpg";
import heroMobile from "../../../public/hero-mobile.jpg";

const categories = [
  {
    title: "Dresses",
    image: "https://ik.imagekit.io/airaclothing/products/NYWT2_lyl5uLwaUt.jpeg",
    link: "/dresses",
    placeholder:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAAECAIAAADETxJQAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAM0lEQVR4nAEoANf/AJ+AbHJcSjsqHQD05tDDyqATCQAA+/jsqraPDQcAAOfo57CypVpaWWloEsWUdgnVAAAAAElFTkSuQmCC",
  },
  {
    title: "Co-ord Set",
    image: "https://ik.imagekit.io/airaclothing/products/952CP_j_5m87cQFf.jpeg",
    link: "/co-ord-set",
    placeholder:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAAECAIAAADETxJQAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAM0lEQVR4nAEoANf/AIloVls/MxoCAADt2tDy3d5TR0AA/fX1//r/cmloAOfg47+vtqOfoIL6FiHBguJtAAAAAElFTkSuQmCC",
  },
  {
    title: "Skirts",
    image: "https://ik.imagekit.io/airaclothing/products/HA8PA_ank2Yo34kB.jpeg",
    link: "/skirts",
    placeholder:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAAECAIAAADETxJQAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAMUlEQVR4nGNoTgpwN1JV4GNguLJvQ0JAiCgrA8P/X1/KM4tMNJUYbl86s2hKb3NDLQATUA/cwxSu3AAAAABJRU5ErkJggg==",
  },
  {
    title: "Ethnic",
    image: "https://ik.imagekit.io/airaclothing/products/9DBBL_s8HtndUj-U.jpeg",
    link: "/ethnic",
    placeholder:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAAECAIAAADETxJQAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAM0lEQVR4nAEoANf/AEw0JCwcEhwAAAC9rqQnLTYvIx0A9vTwBig8a2BZAOff3Kqus7Sxr+QCD0zvn8+EAAAAAElFTkSuQmCC",
  },
];

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On all Orders",
  },
  {
    icon: Headphones,
    title: "Customer Care",
    description: "Available 24/7",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description: "With Razorpay",
  },
  {
    icon: LuHeartHandshake,
    title: "BY WOMEN, FOR WOMEN",
    description: "Functional Design",
  },
];

export default function Home() {
  return (
    <div>
      <div className="relative h-screen w-screen">
        <Image
          src={heroDesktop}
          className="bg-fixed object-cover max-md:hidden"
          fill
          alt="Hero Image"
          priority
          quality={100}
          fetchPriority="high"
          placeholder="blur"
        />
        <div className="flex h-full items-center justify-center">
          <div className="z-[2] flex flex-col items-center space-y-4">
            <h2 className="px-3 text-center text-3xl font-semibold text-balance text-white uppercase lg:text-4xl">
              The Summer Linen Edit ‘ 25
            </h2>
            <Link href={"/shop-all"}>
              <button className="w-fit cursor-pointer border-[1.5px] border-white p-2 text-sm font-medium text-white uppercase">
                Shop All
              </button>
            </Link>
          </div>
        </div>
        <Image
          src={heroMobile}
          className="object-cover md:hidden"
          fill
          alt="Hero Image"
          priority
          quality={100}
          fetchPriority="high"
          placeholder="blur"
        />
      </div>
      <Container className="py-10">
        <h3 className="text-primary text-center text-lg font-extrabold tracking-[0.2em] uppercase">
          Everyday, Elevated
        </h3>
      </Container>
      <div className="mb-[50px] grid grid-cols-2 justify-items-center gap-3 px-2 lg:grid-cols-4 lg:px-10">
        {categories.map((cat) => (
          <Link
            href={cat.link}
            key={cat.title}
            className="group relative aspect-[9/16] w-full max-w-[400px] overflow-hidden rounded-lg"
          >
            <div>
              <Image
                src={convertImage(cat.image, 600)}
                fill
                priority
                className="object-cover duration-200 group-hover:scale-105"
                placeholder="blur"
                blurDataURL={cat.placeholder}
                alt="category image"
              />
              <div className="absolute inset-0 bg-black/35" />
              <div className="absolute inset-0 flex items-center justify-center">
                <h2 className="text-white uppercase md:text-2xl">{cat.title}</h2>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <Container className="my-[70px] flex flex-col gap-x-10 px-4 lg:flex-row">
        <div className="flex basis-[60%] flex-col space-y-4">
          <div className="flex flex-col space-y-2">
            <h3 className="text-primary text-4xl font-semibold">About us</h3>
            <p className="text-primary font-medium">Our story, Our promise.</p>
          </div>
          <p className="text-pretty">
            Founded in 2025, Aira is your proudly home grown destination for effortlessly
            stylish and surprisingly affordable fashion. From laid back weekend casuals
            and eye catching party looks to sun ready resort pieces, polished office
            separates and wardrobe essential staples, every collection is thoughtfully
            crafted to blend luxe touches with sustainable practices. <br /> <br />{" "}
            Discover your new favorite outfits and feel confident wherever life takes you,
            Aira makes looking and feeling good with comfort that&apos;s as easy as
            breathing.
          </p>
          <Link href={"/about"}>
            <Button variant={"outline"} className="w-fit justify-start">
              Know more
            </Button>
          </Link>
        </div>
        <div className="relative aspect-video w-full max-w-[1000px] basis-[40%] max-lg:mt-8">
          <Image
            src={hanger}
            placeholder="blur"
            fill
            alt="Hanger Image"
            className="aspect-video rounded-md object-cover"
          />
        </div>
      </Container>
      <Container className="relative mb-[50px] aspect-video">
        <Image
          src={"/fabric.jpg"}
          className="aspect-video object-cover"
          fill
          alt="fabric"
        />
      </Container>
      <Container className="px-2">
        <div className="mb-12 grid grid-cols-2 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card
                key={index}
                className="bg-card m-0 w-full border-none px-0 py-0 shadow-none"
              >
                <CardContent className="px-0 text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="bg-primary/20 flex size-14 items-center justify-center rounded-full p-2">
                      <IconComponent className="text-primary size-7" strokeWidth={1.1} />
                    </div>
                  </div>
                  <h3 className="text-card-foreground font-medium tracking-tight uppercase">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground px-2 text-sm leading-relaxed text-balance">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </Container>
      <Footer />
    </div>
  );
}
