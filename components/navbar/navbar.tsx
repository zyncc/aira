"use client";

import React, { useEffect, useState } from "react";
import { LuMenu } from "react-icons/lu";
import logo from "/public/logo.png";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
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
import { Search, User2 } from "lucide-react";
import Image from "next/image";
import { categories } from "@/lib/zodSchemas";

const Navbar = () => {
  const { data: session } = useSession();
  const pathName = usePathname();
  const [isTransparent, setIsTransparent] = useState(pathName === "/");
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    setIsTransparent(pathName === "/");
  }, [pathName]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const viewportHeight = window.innerHeight;

      setIsTransparent(pathName === "/" && currentScrollY <= viewportHeight);

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, pathName]);

  return (
    <header
      className={`z-10 header pb-4 pt-4 w-full fixed top-0 transition-all duration-300 ${
        isTransparent
          ? "text-white bg-transparent"
          : "text-black bg-background shadow-md"
      } ${!isTransparent ? "shadow-md" : "shadow-none"}`}
    >
      <nav className="container flex justify-between items-center">
        <div className="hidden lg:block">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/" className={navigationMenuTriggerStyle()}>
                  Home
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/about" className={navigationMenuTriggerStyle()}>
                  About
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="w-[200px] p-2">
                    {categories.map((category) => (
                      <li key={category}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={`/${category
                              .toLowerCase()
                              .replaceAll(" ", "-")}`}
                            className="block select-none space-y-1 rounded-md p-3 text-nowrap leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground font-medium"
                          >
                            {category.toUpperCase()}
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              {session?.user.role === "admin" && (
                <NavigationMenuItem>
                  <Link href="/admin" className={navigationMenuTriggerStyle()}>
                    Admin
                  </Link>
                </NavigationMenuItem>
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <Sheet>
          <SheetTrigger className="lg:hidden max-lg:-order-2">
            <LuMenu
              size={19}
              strokeWidth={3}
              className={`cursor-pointer ${isTransparent ? "text-white" : "text-primary"}`}
            />
          </SheetTrigger>
          <SheetContent className="flex flex-col text-left p-5" side="left">
            <SheetTitle className="hidden">Menu</SheetTitle>
            <Link className="font-medium text-[15px]" href={"/"}>
              <SheetClose>Home</SheetClose>
            </Link>
            <Link className="font-medium text-[15px]" href={"/about"}>
              <SheetClose>About</SheetClose>
            </Link>

            {session?.user.role === "admin" && (
              <Link className="font-medium text-[15px]" href={"/admin"}>
                <SheetClose>Admin</SheetClose>
              </Link>
            )}
            <Accordion type="single" defaultValue="item-1" collapsible>
              <AccordionItem value="item-1" className="border-none">
                <AccordionTrigger className="text-md font-medium pt-0">
                  Categories
                </AccordionTrigger>
                <AccordionContent className="pl-2">
                  <div className="flex flex-col gap-y-4">
                    {categories.map((category) => (
                      <Link
                        key={category}
                        className="font-medium text-[15px]"
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
            <Link href={"/account"} aria-label="Account">
              <User2
                strokeWidth={3}
                size={19}
                className={`cursor-pointer ${isTransparent ? "text-white" : "text-primary"}`}
              />
            </Link>
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
    </header>
  );
};

export default Navbar;
