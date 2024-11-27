import React from "react";
import { Button } from "../ui/button";
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
import { signOut } from "@/auth";
import getSession from "@/lib/getSession";
import {
  SignInButton,
  SignInButtonMobile,
} from "@/components/navbar/signInButton";
import prisma from "@/lib/prisma";
import CartSheet from "./CartSheet";

const Navbar = async () => {
  const session = await getSession();

  let CartItems;
  if (session?.user) {
    CartItems = await prisma.cart.findUnique({
      where: {
        userId: session?.user.id,
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                quantity: true,
              },
            },
          },
        },
      },
    });
  }

  return (
    <header className="z-10 header pb-4 pt-4 w-full sticky top-0 left-0 right-0 bg-white text-black">
      <nav className="container flex justify-between items-center ">
        <Link href={"/"}>
          <h1 className="font-semibold text-2xl">AIRA</h1>
        </Link>
        <div className="hidden lg:block">
          <Menubar className="flex gap-x-6">
            <MenubarMenu>
              <MenubarTrigger>
                <Link className="font-medium text-[15px]" href={"/"}>
                  Home
                </Link>
              </MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>
                <Link className="font-medium text-[15px]" href={"/about"}>
                  About
                </Link>
              </MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger className="cursor-pointer font-medium text-[15px]">
                Categories
              </MenubarTrigger>
              <MenubarContent>
                <Link className="font-medium text-[15px]" href={"/men"}>
                  <MenubarItem>MEN</MenubarItem>
                </Link>
                <Link className="font-medium text-[15px]" href={"/co-ord-sets"}>
                  <MenubarItem>CO-ORD SETS</MenubarItem>
                </Link>
                <Link className="font-medium text-[15px]" href={"/pants"}>
                  <MenubarItem>PANTS</MenubarItem>
                </Link>
                <Link className="font-medium text-[15px]" href={"/jumpsuits"}>
                  <MenubarItem>JUMPSUITS</MenubarItem>
                </Link>
                <Link className="font-medium text-[15px]" href={"/shorts"}>
                  <MenubarItem>SHORTS</MenubarItem>
                </Link>
                <Link className="font-medium text-[15px]" href={"/dresses"}>
                  <MenubarItem>DRESSES</MenubarItem>
                </Link>
                <Link className="font-medium text-[15px]" href={"/outerwear"}>
                  <MenubarItem>OUTERWEAR</MenubarItem>
                </Link>
                <Link className="font-medium text-[15px]" href={"/tops"}>
                  <MenubarItem>TOPS</MenubarItem>
                </Link>
                <Link className="font-medium text-[15px]" href={"/skirts"}>
                  <MenubarItem>SKIRTS</MenubarItem>
                </Link>
                <Link className="font-medium text-[15px]" href={"/lounge-wear"}>
                  <MenubarItem>LOUNGE WEAR</MenubarItem>
                </Link>
              </MenubarContent>
            </MenubarMenu>
            {session?.user && (
              <MenubarMenu>
                <MenubarTrigger>
                  <Link className="font-medium text-[15px]" href={"/account"}>
                    Account
                  </Link>
                </MenubarTrigger>
              </MenubarMenu>
            )}
            {session?.user.role === "Admin" && (
              <MenubarMenu>
                <MenubarTrigger>
                  <Link className="font-medium text-[15px]" href={"/admin"}>
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
          <CartSheet CartItems={CartItems} session={session} />
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
              {session?.user.role === "Admin" && (
                <Link className="font-medium text-[15px]" href={"/admin"}>
                  <SheetClose>Admin</SheetClose>
                </Link>
              )}
              <div className="absolute bottom-5 right-5">
                {session?.user ? (
                  <form
                    action={async () => {
                      "use server";
                      await signOut();
                    }}
                  >
                    <SheetClose>
                      <Button variant={"secondary"} type="submit">
                        Sign out
                      </Button>
                    </SheetClose>
                  </form>
                ) : (
                  <SignInButtonMobile />
                )}
              </div>
            </SheetContent>
          </Sheet>
          {session?.user ? (
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <Button
                variant={"secondary"}
                type="submit"
                className="hidden lg:block ml-3"
              >
                Sign out
              </Button>
            </form>
          ) : (
            <SignInButton />
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
