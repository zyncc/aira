"use cache";

import { cacheLife } from "next/cache";
import Link from "next/link";
import { BsInstagram } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa";

const Footer = async () => {
  cacheLife("max");
  return (
    <footer className="bg-primary w-full text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contact</h3>
            <div className="flex flex-col space-y-2">
              <div className="flex flex-col justify-center gap-y-2">
                <Link href="mailto:support@airaclothing.in" className="text-sm">
                  support@airaclothing.in
                </Link>
                <Link
                  target="_blank"
                  href={"https://wa.me/919731783950"}
                  className="text-sm"
                >
                  9731783950 (Whatsapp)
                </Link>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/">Home</Link>
              <Link href="/about">Our Story</Link>
              <Link href="/shop-all">Shop All</Link>
            </nav>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Legal</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/terms">Terms & Conditions</Link>
              <Link href="/refunds">Refunds and Exchange</Link>
            </nav>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Follow Us</h3>
            <nav className="flex flex-col space-y-2">
              <Link
                href="https://www.instagram.com/aira_clothing.in"
                target="_blank"
                className="flex items-center gap-x-2"
              >
                <BsInstagram />
                Instagram
              </Link>
              <Link
                href="https://facebook.com"
                target="_blank"
                className="flex items-center gap-x-2"
              >
                <FaFacebook />
                Facebook
              </Link>
            </nav>
          </div>
        </div>
      </div>
      <div className="border-t">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm font-medium text-white">
            © {new Date().getFullYear()} Aira. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
