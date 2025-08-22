import Footer from "@/components/footer";
import { convertImage } from "@/lib/convert-image";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Aira is a homegrown brand catering to all your fashion needs at a one-stop destination for casuals, Party wear, Resort wear, Office wear, Everyday staples, that is committed to making you look good anytime, anywhere. Explore our wide range of products that embodies luxury and sustainability.",
};

export default function About() {
  return (
    <div className="min-h-screen text-base">
      <div className="container mx-auto px-4 py-16">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <div className="space-y-16">
            <div className="space-y-4">
              <h1 className="text-5xl font-semibold md:text-6xl">About</h1>
              <p className="text-xl font-medium">Our story, Our Promise.</p>
            </div>
            <div className="space-y-6">
              <p className="text-justify">
                Founded in 2025, Aira is your proudly home grown destination for
                effortlessly stylish and surprisingly affordable fashion. From laid back
                weekend casuals and eye catching party looks to sun-ready resort pieces,
                polished office separates and wardrobe essential staples, every collection
                is thoughtfully crafted to blend luxe touches with sustainable practices.
              </p>
              <p className="text-justify">
                Discover your new favorite outfits and feel confident wherever life takes
                you, Aira makes looking and feeling good with comfort that&apos;s as easy
                as breathing.
              </p>
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Our story</h2>
              <p className="leading-relaxed">
                Born out of a love for fashion and a desire to make a statement, Aira was
                founded on the principles of creativity, uniqueness, and customer
                satisfaction. Our team of designers, artisans, and enthusiasts work
                tirelessly to bring you the latest trends, timeless classics, and
                everything in between.
              </p>
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Our mission.</h2>
              <p className="leading-relaxed">
                Here at Aira, we&apos;re committed to crafting more than just clothes -
                we&apos;re creating experiences that inspire confidence and
                self-expression. Focused on exceptional quality, from luxurious fabrics to
                meticulous design and unparalleled comfort, we are rooted in the belief
                that fashion should be accessible to everyone. To create clothing
                that&apos;s both stylish and affordable & most importantly inclusive.
              </p>
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Our collection.</h2>
              <div className="space-y-4">
                <p className="leading-relaxed">
                  At Aira, Every set is curated to make you feel stunning and comfortable,
                  no matter the occasion. Designed in-house by our team here in Bangalore,
                  each set is rigorously tested and re-invented to add a touch of bespoke
                  elegance to your wardrobe.
                </p>
                <p className="leading-relaxed">
                  We focus on creating timeless designs that transcend seasons and trends.
                  With meticulous attention to silhouette and fabric quality, Each piece
                  in our collection is a testament to our dedication to quality and our
                  passion for everlasting style.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Written in Linen.</h2>
              <p className="leading-relaxed">
                We are so proud of how far we have come in this journey of building our
                clothing brand, and this is just the beginning. As a brand built on linen
                and Naturalness, this shall always remain our core that is rooted in the
                simplicity of Linen. We cannot wait to continue to grow with our community
                and introduce new surprises along the way.
              </p>
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Welcome, Join Us.</h2>
              <p className="leading-relaxed">
                Explore our collections, discover your new favorite pieces, and join the
                Aira community. Stay up-to-date with the latest news, behind-the-scenes
                insights, and exclusive promotions.
              </p>
              <p className="leading-relaxed">
                Stay in touch with us via our social media pages and email to be in the
                know about our upcoming launch.
              </p>
            </div>
            <div className="space-y-6 lg:hidden">
              <h2 className="text-3xl font-bold">Meet the Founder.</h2>
              <div className="space-y-4">
                <Image
                  src={convertImage("https://ik.imagekit.io/airaa/founder", 700)}
                  alt="Priyanka - Founder of Aira"
                  width={400}
                  height={400}
                  className="aspect-square w-full rounded-lg object-cover shadow-2xl"
                />
                <div className="space-y-2 text-center">
                  <p className="text-sm font-medium tracking-wide text-gray-600 uppercase">
                    Architect, Entrepreneur.
                  </p>
                  <h3 className="text-2xl font-bold">
                    The Architect&apos;s Fashion Vision.
                  </h3>
                </div>
                <div className="space-y-4">
                  <p className="leading-relaxed">
                    Meet Priyanka, the founder of Aira. Priyanka&apos;s roots remained
                    strong in fashion from a young age. Fueled by a lifelong passion for
                    style that reflects her unique perspective and aesthetic, Starting her
                    own clothing brand felt like a natural to her. She&apos;s sharing her
                    vision with the world - a heartfelt gift from her soul to yours.
                  </p>
                  <p className="leading-relaxed">
                    Priyanka continues to lead the team at Aira with her vision that she
                    has for the brand.
                  </p>
                  <p className="leading-relaxed">
                    Beyond Aira, Priyanka is a kind, creative soul. She loves travel, A
                    cocktail & not taking life too seriously.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="sticky top-[100px] hidden lg:block">
            <div className="space-y-8">
              <div className="relative">
                <Image
                  src={convertImage("https://ik.imagekit.io/airaa/founder", 700)}
                  alt="Priyanka - Founder of Aira"
                  width={400}
                  height={400}
                  className="aspect-square w-full rounded-lg object-cover shadow-2xl"
                />
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium tracking-wide uppercase">
                    Architect, Entrepreneur.
                  </p>
                  <h2 className="text-3xl font-bold">Meet the Founder.</h2>
                  <h3 className="text-xl font-semibold">
                    The Architect&apos;s Fashion Vision.
                  </h3>
                </div>
                <div className="space-y-4">
                  <p className="leading-relaxed">
                    Meet Priyanka, the founder of Aira. Priyanka&apos;s roots remained
                    strong in fashion from a young age. Fueled by a lifelong passion for
                    style that reflects her unique perspective and aesthetic, Starting her
                    own clothing brand felt like a natural to her.
                  </p>
                  <p className="leading-relaxed">
                    She&apos;s sharing her vision with the world - a heartfelt gift from
                    her soul to yours.
                  </p>
                  <p className="leading-relaxed">
                    Priyanka continues to lead the team at Aira with her vision that she
                    has for the brand.
                  </p>
                  <p className="leading-relaxed">
                    Beyond Aira, Priyanka is a kind, creative soul. She loves travel, A
                    cocktail & not taking life too seriously.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
