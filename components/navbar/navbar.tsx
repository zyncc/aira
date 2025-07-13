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
import { Search } from "lucide-react";
import Image from "next/image";
import { categories } from "@/lib/zodSchemas";
import Wishlist from "../Wishlist";

const Navbar = () => {
  return (
    <header
      className={`z-10 pb-4 pt-4 w-screen fixed top-0 transition-all duration-300 flex flex-col justify-center items-center ${"text-black bg-background shadow-md"}`}
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
        </div>
        <Sheet>
          <SheetTrigger className="lg:hidden max-lg:-order-2">
            <LuMenu
              size={24}
              strokeWidth={2}
              className={`cursor-pointer text-primary`}
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
              <SignInButton />
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
            <Wishlist />
            <Link href={"/search"} aria-label="Search">
              <Search
                strokeWidth={2}
                size={24}
                className={`cursor-pointer text-primary`}
              />
            </Link>
            <CartSheet />
          </div>

          <SignInButton className={"hidden lg:block"} />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
