import React from "react";
import { IoSearch } from "react-icons/io5";
import { LuMenu } from "react-icons/lu";
import Link from "next/link";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
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
import { auth } from "@/auth";
import {
  SignInButton,
  SignInButtonMobile,
} from "@/components/navbar/signInButton";
import CartSheet from "./CartSheet";
import { headers } from "next/headers";
import SignOutButton from "../SignIn/SignOutButton";
import { Button } from "../ui/button";
import SignOutButtonMobile from "../SignIn/SignOutButtonMobile";

const Navbar = async () => {
  const session = await auth.api.getSession({
    headers: headers(),
  });
  return (
    <header className="z-10 header pb-4 pt-4 w-full fixed top-0 left-0 right-0 bg-background text-black">
      <nav className="container flex justify-between items-center ">
        <Link href={"/"}>
          <h1 className="font-semibold text-2xl">AIRA</h1>
        </Link>
        <div className="hidden lg:block">
          <Menubar className="flex gap-x-6">
            <MenubarMenu>
              <MenubarTrigger>
                <Link
                  className="font-medium text-[15px] hover:text-[#67837c]"
                  href={"/"}
                >
                  Home
                </Link>
              </MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>
                <Link
                  className="font-medium text-[15px] hover:text-[#67837c]"
                  href={"/about"}
                >
                  About
                </Link>
              </MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger className="cursor-pointer font-medium text-[15px] hover:text-[#67837c]">
                Categories
              </MenubarTrigger>
              <MenubarContent>
                <Link
                  className="font-medium text-[15px] hover:text-[#67837c]"
                  href={"/men"}
                >
                  <MenubarItem>MEN</MenubarItem>
                </Link>
                <Link
                  className="font-medium text-[15px] hover:text-[#67837c]"
                  href={"/co-ord-sets"}
                >
                  <MenubarItem>CO-ORD SETS</MenubarItem>
                </Link>
                <Link
                  className="font-medium text-[15px] hover:text-[#67837c]"
                  href={"/pants"}
                >
                  <MenubarItem>PANTS</MenubarItem>
                </Link>
                <Link
                  className="font-medium text-[15px] hover:text-[#67837c]"
                  href={"/jumpsuits"}
                >
                  <MenubarItem>JUMPSUITS</MenubarItem>
                </Link>
                <Link
                  className="font-medium text-[15px] hover:text-[#67837c]"
                  href={"/shorts"}
                >
                  <MenubarItem>SHORTS</MenubarItem>
                </Link>
                <Link
                  className="font-medium text-[15px] hover:text-[#67837c]"
                  href={"/dresses"}
                >
                  <MenubarItem>DRESSES</MenubarItem>
                </Link>
                <Link
                  className="font-medium text-[15px] hover:text-[#67837c]"
                  href={"/outerwear"}
                >
                  <MenubarItem>OUTERWEAR</MenubarItem>
                </Link>
                <Link
                  className="font-medium text-[15px] hover:text-[#67837c]"
                  href={"/tops"}
                >
                  <MenubarItem>TOPS</MenubarItem>
                </Link>
                <Link
                  className="font-medium text-[15px] hover:text-[#67837c]"
                  href={"/skirts"}
                >
                  <MenubarItem>SKIRTS</MenubarItem>
                </Link>
                <Link
                  className="font-medium text-[15px] hover:text-[#67837c]"
                  href={"/lounge-wear"}
                >
                  <MenubarItem>LOUNGE WEAR</MenubarItem>
                </Link>
              </MenubarContent>
            </MenubarMenu>
            {session?.user && (
              <MenubarMenu>
                <MenubarTrigger>
                  <Link
                    className="font-medium text-[15px] hover:text-[#67837c]"
                    href={"/account"}
                  >
                    Account
                  </Link>
                </MenubarTrigger>
              </MenubarMenu>
            )}
            {session?.user.role === "admin" && (
              <MenubarMenu>
                <MenubarTrigger>
                  <Link
                    className="font-medium text-[15px] hover:text-[#67837c]"
                    href={"/admin"}
                  >
                    Admin
                  </Link>
                </MenubarTrigger>
              </MenubarMenu>
            )}
          </Menubar>
        </div>
        <div className="flex items-center justify-between">
          <Link className="font-medium text-[15px]" href={"/search"}>
            <IoSearch size={28} className="ml-3" />
          </Link>
          <CartSheet session={session} />
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
              {session?.user && (
                <Link className="font-medium text-[15px]" href={"/account"}>
                  <SheetClose>Account</SheetClose>
                </Link>
              )}
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
                <SheetClose>
                  <SignOutButtonMobile />
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
          {session?.session ? <SignOutButton /> : <SignInButton />}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
