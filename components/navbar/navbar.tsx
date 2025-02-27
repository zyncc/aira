"use client";

import React from "react";
import { IoSearch } from "react-icons/io5";
import { LuMenu } from "react-icons/lu";
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
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { SignInButton } from "@/components/navbar/signInButton";
import CartSheet from "./CartSheet";
import SignOutButton from "../SignIn/SignOutButton";
import { useSession } from "@/lib/authClient";
import SignedOutCartSheet from "./SignedOutCartSheet";

const categories = [
  "MEN",
  "CO-ORD SETS",
  "PANTS",
  "JUMPSUITS",
  "SHORTS",
  "DRESSES",
  "OUTERWEAR",
  "TOPS",
  "SKIRTS",
  "LOUNGE WEAR",
];

const Navbar = () => {
  const { data: session } = useSession();
  return (
    <header className="z-10 header pb-4 pt-4 w-full fixed top-0 left-0 right-0 bg-background text-black">
      <nav className="container flex justify-between items-center ">
        <Link href={"/"}>
          <h1 className="font-semibold text-2xl">Aira</h1>
        </Link>
        <div className="hidden lg:block">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/about" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    About
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
                <NavigationMenuContent className="bg-background">
                  <ul className="w-[200px] p-2">
                    {categories.map((category) => (
                      <li key={category}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={`/${category
                              .toLowerCase()
                              .replace(" ", "-")}`}
                            className="block select-none space-y-1 rounded-md p-3 text-nowrap leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground font-medium"
                          >
                            {category}
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/account" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Account
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              {session?.user.role === "admin" && (
                <NavigationMenuItem>
                  <Link href="/admin" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      Admin
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex items-center justify-between">
          <Link className="font-medium text-[15px]" href={"/search"}>
            <IoSearch size={28} className="ml-3" />
          </Link>
          {session?.session ? <CartSheet /> : <SignedOutCartSheet />}
          <Sheet>
            <SheetTrigger className="lg:hidden">
              <LuMenu size={30} className="ml-3" />
            </SheetTrigger>
            <SheetContent className="flex flex-col text-left" side="left">
              <Link className="font-medium text-[15px]" href={"/"}>
                <SheetClose>Home</SheetClose>
              </Link>
              <Link className="font-medium text-[15px]" href={"/about"}>
                <SheetClose>About</SheetClose>
              </Link>
              <Link className="font-medium text-[15px]" href={"/account"}>
                <SheetClose>Account</SheetClose>
              </Link>
              <Accordion type="single" collapsible defaultValue="item-1">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-md font-medium">
                    Categories
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-4 pt-4 flex flex-col gap-y-4">
                      <Link className="font-medium text-[15px]" href={"/men"}>
                        <SheetClose>MEN</SheetClose>
                      </Link>
                      <Link
                        className="font-medium text-[15px]"
                        href={"/co-ord-sets"}
                      >
                        CO-ORD SETS
                      </Link>
                      <Link className="font-medium text-[15px]" href={"/pants"}>
                        <SheetClose>PANTS</SheetClose>
                      </Link>
                      <Link
                        className="font-medium text-[15px]"
                        href={"/jumpsuits"}
                      >
                        <SheetClose>JUMPSUITS</SheetClose>
                      </Link>
                      <Link
                        className="font-medium text-[15px]"
                        href={"/shorts"}
                      >
                        <SheetClose>SHORTS</SheetClose>
                      </Link>
                      <Link
                        className="font-medium text-[15px]"
                        href={"/dresses"}
                      >
                        <SheetClose>DRESSES</SheetClose>
                      </Link>
                      <Link
                        className="font-medium text-[15px]"
                        href={"/outerwear"}
                      >
                        <SheetClose>OUTERWEAR</SheetClose>
                      </Link>
                      <Link className="font-medium text-[15px]" href={"/tops"}>
                        <SheetClose>TOPS</SheetClose>
                      </Link>
                      <Link
                        className="font-medium text-[15px]"
                        href={"/skirts"}
                      >
                        <SheetClose>SKIRTS</SheetClose>
                      </Link>
                      <Link
                        className="font-medium text-[15px]"
                        href={"/lounge-wear"}
                      >
                        <SheetClose>LOUNGE WEAR</SheetClose>
                      </Link>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              {session?.user.role === "admin" && (
                <Link className="font-medium text-[15px]" href={"/admin"}>
                  <SheetClose>Admin</SheetClose>
                </Link>
              )}
              <div className="absolute bottom-5 right-5">
                {session?.session ? <SignOutButton /> : <SignInButton />}
              </div>
            </SheetContent>
          </Sheet>
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
