"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { LoaderCircleIcon, MicIcon, Search, SearchIcon } from "lucide-react";
import { Search as SearchProducts } from "@/actions/searchProducts";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

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

type SearchProducts = {
  id: string;
  title: string;
  price: number;
  images: string[];
  category: string;
}[];

const Navbar = () => {
  const { data: session } = useSession();
  const pathName = usePathname();
  const [open, setOpen] = useState(false);
  const [isTransparent, setIsTransparent] = useState(pathName === "/");
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [products, setProducts] = useState<SearchProducts>([]);
  const [loading, setLoading] = useState(false);

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (inputValue) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
    setIsLoading(false);
  }, [inputValue]);

  // Function to fetch products based on search input
  const fetchProducts = async (query: string) => {
    if (!query) return setProducts([]);
    console.log(query);
    setLoading(true);
    try {
      const data = await SearchProducts(query);
      setProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Debounce search input to avoid excessive API calls
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (inputValue) {
        fetchProducts(inputValue);
      } else {
        setProducts([]); // Clear results when empty
      }
    }, 500); // Adjust debounce delay as needed

    return () => clearTimeout(delayDebounce);
  }, [inputValue]);

  useEffect(() => {
    setIsTransparent(pathName === "/");
  }, [pathName]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const viewportHeight = window.innerHeight;

      setIsTransparent(pathName === "/" && currentScrollY <= viewportHeight);

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

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
      } ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"} ${
        !isTransparent ? "shadow-md" : "shadow-none"
      }`}
    >
      <nav className="container flex justify-between items-center">
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
                <NavigationMenuContent>
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
        <Sheet>
          <SheetTrigger className="lg:hidden max-lg:-order-2">
            <LuMenu size={28} />
          </SheetTrigger>
          <SheetContent className="flex flex-col text-left p-5" side="left">
            <SheetTitle className="hidden">Menu</SheetTitle>
            <Link className="font-medium text-[15px]" href={"/"}>
              <SheetClose>Home</SheetClose>
            </Link>
            <Link className="font-medium text-[15px]" href={"/about"}>
              <SheetClose>About</SheetClose>
            </Link>
            <Link className="font-medium text-[15px]" href={"/account"}>
              <SheetClose>Account</SheetClose>
            </Link>
            {session?.user.role === "admin" && (
              <Link className="font-medium text-[15px]" href={"/admin"}>
                <SheetClose>Admin</SheetClose>
              </Link>
            )}
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1" className="border-none">
                <AccordionTrigger className="text-md font-medium pt-0">
                  Categories
                </AccordionTrigger>
                <AccordionContent className="pl-2">
                  <div className="flex flex-col gap-y-4">
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
                    <Link className="font-medium text-[15px]" href={"/shorts"}>
                      <SheetClose>SHORTS</SheetClose>
                    </Link>
                    <Link className="font-medium text-[15px]" href={"/dresses"}>
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
                    <Link className="font-medium text-[15px]" href={"/skirts"}>
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
            <div className="absolute bottom-5 right-5">
              {session?.session ? <SignOutButton /> : <SignInButton />}
            </div>
          </SheetContent>
        </Sheet>
        <Link href={"/"} className="max-lg:-order-2 lg:-order-1">
          <h1 className="font-semibold text-2xl">Aira</h1>
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex gap-x-2 items-center">
            <Dialog>
              <DialogTrigger>
                <Search
                  size={25}
                  className="cursor-pointer hidden lg:block"
                  onClick={() => setOpen(true)}
                />
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Search Products</DialogTitle>
                  <div className="relative mt-4">
                    <Input
                      className="peer ps-9 pe-9"
                      placeholder="Search..."
                      type="search"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                    />
                    <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                      {isLoading ? (
                        <LoaderCircleIcon
                          className="animate-spin"
                          size={16}
                          role="status"
                          aria-label="Loading..."
                        />
                      ) : (
                        <SearchIcon size={16} aria-hidden="true" />
                      )}
                    </div>
                  </div>
                </DialogHeader>
              </DialogContent>
            </Dialog>

            <CartSheet />
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
