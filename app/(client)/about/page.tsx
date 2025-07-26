import type { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Aira is a homegrown brand catering to all your fashion needs at a one-stop destination for casuals, Party wear, Resort wear, Office wear, Everyday staples, that is committed to making you look good anytime, anywhere. Explore our wide range of products that embodies luxury and sustainability.",
};

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Content */}
          <div className="space-y-16">
            {/* Hero */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
                About
              </h1>
              <p className="text-xl text-gray-600 font-medium">
                Our story, No Promise.
              </p>
            </div>

            {/* Main Description */}
            <div className="space-y-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                Founded in 2025, Aira is your proudly home-grown destination for
                effortlessly stylish and surprisingly affordable fashion. From
                laid-back weekend casuals and eye-catching party looks to
                sun-ready resort pieces, polished office separates and
                wardrobe-essential staples, every collection is thoughtfully
                crafted to blend luxe touches with sustainable practices.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Discover your new favorite outfits and feel confident wherever
                life takes you—Aira makes looking and feeling good with comfort
                that's as easy as breathing.
              </p>
            </div>

            {/* Our Story */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">Our story</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Born out of a love for fashion and a desire to make a statement,
                Aira was founded on the principles of creativity, uniqueness,
                and customer satisfaction. Our team of designers, artisans, and
                enthusiasts work tirelessly to bring you the latest trends,
                timeless classics, and everything in between.
              </p>
              <Button variant="outline" className="mt-4">
                Know more
              </Button>
            </div>

            {/* Our Mission */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">Our mission.</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Here at Aira, we're committed to crafting more than just clothes
                - we're creating experiences that inspire confidence and
                self-expression. Focused on exceptional quality, from luxurious
                fabrics to meticulous design and unparalleled comfort, we are
                rooted in the belief that fashion should be accessible to
                everyone. To create clothing that's both stylish and affordable
                & most importantly inclusive.
              </p>
            </div>

            {/* Our Collection */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">
                Our collection.
              </h2>
              <div className="space-y-4">
                {/* <Image src={aboutus} alt="About Us" width={600} height={400} /> */}
                <p className="text-lg text-gray-700 leading-relaxed">
                  At Aira, Every set is curated to make you feel stunning and
                  comfortable, no matter the occasion. Designed in-house by our
                  team here in Bangalore, each set is rigorously tested and
                  re-invented to add a touch of bespoke elegance to your
                  wardrobe.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  We focus on creating timeless designs that transcend seasons
                  and trends. With meticulous attention to silhouette and fabric
                  quality, Each piece in our collection is a testament to our
                  dedication to quality and our passion for everlasting style.
                </p>
              </div>
            </div>

            {/* Written in Linen */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">
                Written in Linen.
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                We are so proud of how far we have come in this journey of
                building our clothing brand, and this is just the beginning. As
                a brand built on linen and Naturalness, this shall always remain
                our core that is rooted in the simplicity of Linen. We cannot
                wait to continue to grow with our community and introduce new
                surprises along the way.
              </p>
            </div>

            {/* Welcome Section */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">
                Welcome, Join Us.
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Explore our collections, discover your new favorite pieces, and
                join the Aira community. Stay up-to-date with the latest news,
                behind-the-scenes insights, and exclusive promotions.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Stay in touch with us via our social media pages and email to be
                in the know about our upcoming launch.
              </p>
            </div>

            {/* Meet the Founder - Mobile */}
            <div className="lg:hidden space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">
                Meet the Founder.
              </h2>
              <div className="space-y-4">
                <Image
                  src="https://res.cloudinary.com/dfdusmp26/image/upload/v1747031599/Products/oyovqlq7xzoo6f2zviwd.jpg"
                  alt="Priyanka - Founder of Aira"
                  width={400}
                  height={400}
                  className="rounded-lg object-cover w-full shadow-2xl aspect-square object-top"
                />
                <div className="text-center space-y-2">
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                    Architect, Entrepreneur.
                  </p>
                  <h3 className="text-2xl font-bold text-gray-900">
                    The Architect's Fashion Vision.
                  </h3>
                </div>
                <div className="space-y-4">
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Meet Priyanka, the founder of Aira. Priyanka's roots
                    remained strong in fashion from a young age. Fueled by a
                    lifelong passion for style that reflects her unique
                    perspective and aesthetic, Starting her own clothing brand
                    felt like a natural to her. She's sharing her vision with
                    the world - a heartfelt gift from her soul to yours.
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Priyanka continues to lead the team at Aira with her vision
                    that she has for the brand.
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Beyond Aira, Priyanka is a kind, creative soul. She loves
                    travel, A cocktail & not taking life too seriously.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Founder Image (Desktop) */}
          <div className="hidden lg:block sticky top-[70px]">
            <div className="space-y-8">
              <div className="relative">
                <Image
                  src="https://res.cloudinary.com/dfdusmp26/image/upload/v1747031599/Products/oyovqlq7xzoo6f2zviwd.jpg"
                  alt="Priyanka - Founder of Aira"
                  width={400}
                  height={400}
                  className="rounded-lg object-cover w-full shadow-2xl aspect-square object-top"
                />
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                    Architect, Entrepreneur.
                  </p>
                  <h2 className="text-3xl font-bold text-gray-900">
                    Meet the Founder.
                  </h2>
                  <h3 className="text-xl font-semibold text-gray-800">
                    The Architect's Fashion Vision.
                  </h3>
                </div>

                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    Meet Priyanka, the founder of Aira. Priyanka's roots
                    remained strong in fashion from a young age. Fueled by a
                    lifelong passion for style that reflects her unique
                    perspective and aesthetic, Starting her own clothing brand
                    felt like a natural to her.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    She's sharing her vision with the world - a heartfelt gift
                    from her soul to yours.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Priyanka continues to lead the team at Aira with her vision
                    that she has for the brand.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Beyond Aira, Priyanka is a kind, creative soul. She loves
                    travel, A cocktail & not taking life too seriously.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
