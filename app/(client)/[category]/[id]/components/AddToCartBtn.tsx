"use client";

import Spinner from "@/components/loadingSpinner";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import { IoCartOutline } from "react-icons/io5";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { RefObject } from "react";
import Image from "next/image";
import { Product } from "@prisma/client";
import formatCurrency from "@/lib/formatCurrency";
import { capitalizeFirstLetter } from "@/lib/caplitaliseFirstLetter";
import { usePathname, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Session } from "@/auth";
import { ShoppingBag } from "lucide-react";

export default function FormSubmitButton({
  product,
  size,
  buttonRef,
  session,
}: {
  product: Product;
  size: string | null;
  buttonRef: RefObject<HTMLButtonElement | null>;
  session: Session | null;
}) {
  const { pending } = useFormStatus();
  const pathname = usePathname();
  const router = useRouter();
  return (
    <>
      <Drawer>
        <DrawerTrigger asChild>
          <button hidden ref={buttonRef}></button>
        </DrawerTrigger>
        <DrawerContent className={"py-6 overflow-hidden"}>
          <div
            className={
              "container h-full w-full flex items-center justify-center flex-col gap-2"
            }
          >
            <DrawerTitle>{product.title}</DrawerTitle>
            <DrawerDescription>has been added to Bag</DrawerDescription>
            <div className="flex gap-2">
              <Badge variant={"secondary"}>
                {(size == "sm" && "Small") ||
                  (size == "md" && "Medium") ||
                  (size == "lg" && "Large") ||
                  (size == "xl" && "XL")}
              </Badge>
              <Badge variant={"secondary"}>
                {capitalizeFirstLetter(product.color)}
              </Badge>
            </div>
            <Image
              src={product.images[0]}
              alt={"Cart Item"}
              height={200}
              width={200}
              className={
                "rounded-lg animate-bounce mt-5 aspect-square object-cover"
              }
            />
            <h1 className={"font-semibold mt-3 text-xl"}>
              {formatCurrency(product.price).split(".")[0]}
            </h1>
          </div>
        </DrawerContent>
      </Drawer>
      <Button
        aria-label="Button"
        className={`rounded-sm w-full py-3 md:py-6 ${
          pending && "hover:cursor-progress font-semibold"
        }`}
        variant={"secondary"}
        size={"lg"}
        type="submit"
        disabled={pending}
      >
        <ShoppingBag className={`mr-3 text-xl ${pending && "hidden"}`} />
        {pending ? <Spinner size={30} /> : `Add to Bag`}
      </Button>
    </>
  );
}
