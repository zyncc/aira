import Link from "next/link";
import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const Footer = () => {
  return (
    <footer className="w-full bg-primary text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-white text-lg font-semibold">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/">Home</Link>
              <Link href="/services">Services</Link>
              <Link href="/about">About</Link>
              <Link href="/contact">Contact</Link>
            </nav>
          </div>
          <div className="space-y-4">
            <h3 className="text-white text-lg font-semibold">Legal</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/terms">Terms of Service</Link>
              <Link href="/refunds">Refunds and Cancellations</Link>
            </nav>
          </div>
          <div className="space-y-4">
            <h3 className="text-white text-lg font-semibold">Follow Us</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="https://instagram.com">Instagram</Link>
              <Link href="https://youtube.com">YouTube</Link>
              <Link href="https://facebook.com">Facebook</Link>
            </nav>
          </div>
          <div className="space-y-4">
            <h3 className="text-white text-lg font-semibold">Newsletter</h3>
            <p className="text-sm">
              Stay updated with our latest news and offers.
            </p>
            <form className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="text-black"
              />
              <Button
                type="submit"
                variant="secondary"
                className="whitespace-nowrap"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>
      <div className="border-t">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-white font-medium">
            © {new Date().getFullYear()} Aira Clothing. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
