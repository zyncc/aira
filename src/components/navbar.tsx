"use client";

import { authClient } from "@/auth/auth-client";
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
import { categories } from "@/lib/zod-schemas";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LuMenu } from "react-icons/lu";
import logo from "../../public/logo.png";
import SignOutButton from "./auth/signout-button";
import { CartSheet } from "./cart";
import { Container } from "./container";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Button } from "./ui/button";

const Navbar = () => {
  const { data: session, isPending, refetch } = authClient.useSession();
  const pathName = usePathname();
  const [isTransparent, setIsTransparent] = useState(pathName === "/");
  const [lastScrollY, setLastScrollY] = useState(0);

  const [hasMounted, setHasMounted] = useState(false);

  const segments = pathName.split("/").filter(Boolean);

  const isOnProductPage =
    segments.length === 2 &&
    categories.some((category) => category.replaceAll(" ", "-") === segments[0]);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    setIsTransparent(pathName === "/");
  }, [pathName]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const viewportHeight = window.innerHeight;

      setIsTransparent(pathName === "/" && currentScrollY <= viewportHeight * 0.3);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, pathName]);

  return (
    <header
      className={`z-10 w-screen ${
        pathName == "/" ? "fixed top-0" : "sticky top-0"
      } flex flex-col items-center justify-center transition-colors duration-300 ${
        isTransparent ? "bg-transparent text-white" : "bg-background text-black shadow-md"
      } ${!isTransparent ? "shadow-md" : "shadow-none"}`}
    >
      <Container className="px-3 py-4">
        <nav className="flex items-center justify-between">
          <div className="hidden justify-between gap-x-5 text-sm font-medium lg:flex">
            <Link href={"/"}>Home</Link>
            <Link href={"/about"}>Our Story</Link>
            <Link href={"/account"}>Account</Link>
            <Link href={"/shop-all"}>Shop All</Link>
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
            {hasMounted && !isPending && session?.user.role === "admin" ? (
              <Link
                href={`${process.env.NEXT_PUBLIC_APP_URL?.split("://")[0]}://admin.${process.env.NEXT_PUBLIC_APP_URL?.split("://")[1]}`}
              >
                Admin
              </Link>
            ) : null}
          </div>
          <Sheet>
            <SheetTrigger className="max-lg:-order-2 lg:hidden">
              <LuMenu
                size={24}
                strokeWidth={2.3}
                className={`cursor-pointer ${isTransparent ? "text-white" : "text-primary"}`}
              />
            </SheetTrigger>
            <SheetContent
              className="flex flex-col gap-4 p-5 text-left text-xl"
              side="left"
            >
              <SheetTitle className="hidden">Menu</SheetTitle>
              <Link className="text-primary text-2xl font-extrabold" href={"/"}>
                <SheetClose>Home</SheetClose>
              </Link>
              <Link className="text-primary text-2xl font-extrabold" href={"/shop-all"}>
                <SheetClose>Shop All</SheetClose>
              </Link>
              <Link className="text-primary text-2xl font-extrabold" href={"/about"}>
                <SheetClose>Our Story</SheetClose>
              </Link>
              <Link className="font-medium" href={"/account"}>
                <SheetClose>Account</SheetClose>
              </Link>
              {hasMounted && !isPending && session?.user.role === "admin" ? (
                <Link
                  className="font-medium"
                  href={`${process.env.NEXT_PUBLIC_APP_URL?.split("://")[0]}://admin.${process.env.NEXT_PUBLIC_APP_URL?.split("://")[1]}`}
                >
                  <SheetClose>Admin</SheetClose>
                </Link>
              ) : null}
              <Accordion type="multiple">
                <AccordionItem value="item-1" className="border-none">
                  <AccordionTrigger className="text-md pt-0 font-medium">
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
              <div className="absolute right-5 bottom-5">
                {hasMounted && !isPending && session ? (
                  <SignOutButton refetch={refetch} session={session} />
                ) : (
                  <Link href={`/signin?callbackUrl=${pathName}`}>
                    <SheetClose asChild>
                      <Button>Sign in</Button>
                    </SheetClose>
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
          <Link href={"/"} className="justify-self-center max-lg:-order-2 lg:-order-1">
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-3">
              {/* <Wishlist isTransparent={isTransparent} /> */}
              <Link href={"/search"} aria-label="Search">
                <Search
                  strokeWidth={2}
                  size={24}
                  className={`cursor-pointer ${isTransparent ? "text-white" : "text-primary"}`}
                />
              </Link>
              <CartSheet isTransparent={isTransparent} />
            </div>
            {hasMounted && !isPending && session ? (
              <SignOutButton
                refetch={refetch}
                session={session}
                className={"hidden lg:block"}
              />
            ) : (
              <Link href={`/signin?callbackUrl=${pathName}`}>
                <Button className="ml-3 hidden lg:block">Sign in</Button>
              </Link>
            )}
          </div>
        </nav>
        {isOnProductPage && (
          <div
            className={`text-primary mt-4 flex w-full items-center justify-evenly text-xs font-semibold tracking-tighter uppercase md:hidden`}
          >
            <Link href={"/dresses"}>Dresses</Link>
            <Link href={"/co-ord-set"}>Co-ords</Link>
            <Link href={"/skirts"}>Skirts</Link>
            <Link href={"/ethnic"}>Ethnic</Link>
          </div>
        )}
      </Container>
    </header>
  );
};

export default Navbar;
