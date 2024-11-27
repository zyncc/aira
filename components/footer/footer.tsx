import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="footer p-4 absolute block bottom-0 right-0 left-0 w-full">
      {/* flex flex-wrap justify-items-center max-[400px]:justify-center
      min-[401px]: justify-evenly gap-6 */}
      <div className="container footer-row grid grid-cols-2 md:grid-cols-4 max-[420px]:grid-cols-1 justify-items-center">
        <div className="footer-col">
          <h1 className="font-semibold text-xl text-center md:text-left ">
            Company
          </h1>
          <div className="mt-4 text-center md:text-left">
            <Link href={""} className="font-medium">
              <h1 className="mb-3">About us</h1>
            </Link>
            <Link href={""} className="font-medium">
              <h1 className="mb-3">Our Services</h1>
            </Link>
            <Link href={""} className="font-medium">
              <h1 className="mb-3">Privacy Policy</h1>
            </Link>
            <Link href={""} className="font-medium">
              <h1 className="mb-3">Affliliate Program</h1>
            </Link>
          </div>
        </div>
        <div className="footer-col">
          <h1 className="font-semibold text-xl text-center md:text-left ">
            Get Help
          </h1>
          <div className="mt-4 text-center md:text-left">
            <Link href={""} className="font-medium">
              <h1 className="mb-3">FAQ</h1>
            </Link>
            <Link href={""} className="font-medium">
              <h1 className="mb-3">Shipping</h1>
            </Link>
            <Link href={""} className="font-medium">
              <h1 className="mb-3">Returns</h1>
            </Link>
            <Link href={""} className="font-medium">
              <h1 className="mb-3">Order Status</h1>
            </Link>
            <Link href={""} className="font-medium">
              <h1 className="mb-3">Payment Options</h1>
            </Link>
          </div>
        </div>
        <div className="footer-col">
          <h1 className="font-semibold text-xl text-center md:text-left">
            Online Shop
          </h1>
          <div className="mt-4 text-center md:text-left">
            <Link href={""} className="font-medium">
              <h1 className="mb-3">Tops</h1>
            </Link>
            <Link href={""} className="font-medium">
              <h1 className="mb-3">Skirts</h1>
            </Link>
            <Link href={""} className="font-medium">
              <h1 className="mb-3">Outer Wear</h1>
            </Link>
            <Link href={""} className="font-medium">
              <h1 className="mb-3">Dresses</h1>
            </Link>
          </div>
        </div>
        <div className="footer-col">
          <h1 className="font-semibold text-xl text-center md:text-left ">
            Social Media
          </h1>
          <div className="mt-4 text-center md:text-left">
            <Link href={""} className="font-medium">
              <h1 className="mb-3">Instagram</h1>
            </Link>
            <Link href={""} className="font-medium">
              <h1 className="mb-3">Facebook</h1>
            </Link>
            <Link href={""} className="font-medium">
              <h1 className="mb-3">YouTube</h1>
            </Link>
          </div>
        </div>
      </div>
      <div className="text-center mt-3">
        <h1 className="font-medium text-md">
          Copyright © 2024 Aira. All Rights Reserved
        </h1>
      </div>
    </footer>
  );
};

export default Footer;
