"use client";

import React, { useEffect, useState } from "react";
import { LuMenu } from "react-icons/lu";
import logo from "@/public/logo.png";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { SignInButton } from "@/components/navbar/signInButton";
import SignOutButton from "../SignIn/SignOutButton";
import { useSession } from "@/lib/authClient";
import { CartSheet } from "../cart/cart-sheet";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import Image from "next/image";
import { categories } from "@/lib/zodSchemas";
import Wishlist from "../Wishlist";

const Navbar = () => {
  const { data: session } = useSession();
  const pathName = usePathname();
  const [isTransparent, setIsTransparent] = useState(pathName === "/");
  const [lastScrollY, setLastScrollY] = useState(0);

  const segments = pathName.split("/").filter(Boolean);

  const isOnProductPage =
    segments.length === 2 &&
    categories.some(
      (category) => category.replaceAll(" ", "-") === segments[0]
    );

  useEffect(() => {
    setIsTransparent(pathName === "/");
  }, [pathName]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const viewportHeight = window.innerHeight;

      setIsTransparent(
        pathName === "/" && currentScrollY <= viewportHeight * 0.3
      );
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, pathName]);

  return (
    <header
      className={`z-10 pb-4 pt-4 w-screen ${pathName == "/" ? "fixed top-0" : "sticky top-0"} transition-all duration-300 flex flex-col justify-center items-center ${
        isTransparent
          ? "text-white bg-transparent"
          : "text-black bg-background shadow-md"
      } ${!isTransparent ? "shadow-md" : "shadow-none"}`}
    >
      <nav className="container flex justify-between items-center">
        <div className="hidden lg:flex justify-between gap-x-5 font-medium text-sm">
          <Link href={"/"}>Home</Link>
          <Link href={"/about"}>About</Link>
          <Link href={"/account"}>Account</Link>
          <DropdownMenu>
            <DropdownMenuTrigger>Categories</DropdownMenuTrigger>
            <DropdownMenuContent className="bg-background">
              {categories.map((category) => (
                <Link key={category} href={`/${category.replaceAll(" ", "-")}`}>
                  <DropdownMenuItem className="font-medium">
                    {category.toUpperCase()}
                  </DropdownMenuItem>
                </Link>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {session?.user.role === "admin" && <Link href={"/admin"}>Admin</Link>}
        </div>
        <Sheet>
          <SheetTrigger className="lg:hidden max-lg:-order-2">
            <LuMenu
              size={21}
              strokeWidth={3}
              className={`cursor-pointer ${isTransparent ? "text-white" : "text-primary"}`}
            />
          </SheetTrigger>
          <SheetContent
            className="flex flex-col gap-7 text-left p-5 text-xl"
            side="left"
          >
            <SheetTitle className="hidden">Menu</SheetTitle>
            <Link className="font-medium" href={"/"}>
              <SheetClose>Home</SheetClose>
            </Link>
            <Link className="font-medium" href={"/about"}>
              <SheetClose>About</SheetClose>
            </Link>
            <Link className="font-medium" href={"/account"}>
              <SheetClose>Account</SheetClose>
            </Link>
            {session?.user.role === "admin" && (
              <Link className="font-medium" href={"/admin"}>
                <SheetClose>Admin</SheetClose>
              </Link>
            )}
            <Accordion type="multiple">
              <AccordionItem value="item-1" className="border-none">
                <AccordionTrigger className="text-md font-medium pt-0">
                  Categories
                </AccordionTrigger>
                <AccordionContent className="pl-2 text-lg">
                  <div className="flex flex-col gap-y-4">
                    {categories.map((category) => (
                      <Link
                        key={category}
                        className="font-medium"
                        href={`/${category.toLowerCase().replaceAll(" ", "-")}`}
                      >
                        <SheetClose>{category.toUpperCase()}</SheetClose>
                      </Link>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <div className="absolute bottom-5 right-5">
              {session?.session ? <SignOutButton /> : <SignInButton />}
            </div>
          </SheetContent>
        </Sheet>
        <Link
          href={"/"}
          className="max-lg:-order-2 justify-self-center lg:-order-1"
        >
          <Image
            src={logo}
            priority
            fetchPriority="high"
            alt="Logo"
            width={70}
            height={70}
            className="object-cover max-lg:ml-12"
          />
        </Link>
        <div className="flex items-center justify-between gap-x-3">
          <div className="flex items-center gap-x-3">
            <Wishlist isTransparent={isTransparent} />
            <Link href={"/search"} aria-label="Search">
              <Search
                strokeWidth={3}
                size={19}
                className={`cursor-pointer ${isTransparent ? "text-white" : "text-primary"}`}
              />
            </Link>
            <CartSheet isTransparent={isTransparent} />
          </div>
          {session?.session ? (
            <SignOutButton className={"hidden lg:block"} />
          ) : (
            <SignInButton className={"hidden lg:block"} />
          )}
        </div>
      </nav>
      {isOnProductPage && (
        <div
          className={`flex md:hidden mt-4 w-full justify-evenly items-center font-semibold text-xs uppercase tracking-tighter text-primary`}
        >
          <Link href={"/dresses"}>dresses</Link>
          <Link href={"/co-ord-set"}>Co-ords</Link>
          <Link href={"/casuals"}>Casuals</Link>
          <Link href={"/skirts"}>Skirts</Link>
          <Link href={"/ethnic"}>Ethnic</Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
