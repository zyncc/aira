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
import { LuMenu } from "react-icons/lu";
import logo from "../../public/logo.png";
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
  const isTransparent = true;

  return (
    <header
      className={`fixed top-0 z-10 flex w-screen flex-col items-center justify-center transition-colors duration-300 ${
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
                <Link prefetch={false} href={`/signin`}>
                  <SheetClose asChild>
                    <Button>Sign in</Button>
                  </SheetClose>
                </Link>
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
              className="object-cover max-lg:ml-10"
            />
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-3">
              <Link href={"/search"} aria-label="Search">
                <Search
                  strokeWidth={2}
                  size={24}
                  className={`cursor-pointer ${isTransparent ? "text-white" : "text-primary"}`}
                />
              </Link>
              <CartSheet isTransparent={isTransparent} />
            </div>
            <Link prefetch={false} href={`/signin?`}>
              <Button className="ml-3 hidden lg:block">Sign in</Button>
            </Link>
          </div>
        </nav>
      </Container>
    </header>
  );
};

export default Navbar;
