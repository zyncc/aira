"use client";

import Spinner from "@/components/loadingSpinner";
import {Button} from "@/components/ui/button";
import {useFormStatus} from "react-dom";
import {IoCartOutline} from "react-icons/io5";
import {Drawer, DrawerContent, DrawerDescription, DrawerTitle, DrawerTrigger,} from "@/components/ui/drawer";
import {RefObject} from "react";
import Image from "next/image";
import {Product} from "@prisma/client";
import formatCurrency from "@/lib/formatCurrency";
import {capitalizeFirstLetter} from "@/lib/caplitaliseFirstLetter";
import {Session} from "next-auth";
import {usePathname, useRouter} from "next/navigation";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {Badge} from "@/components/ui/badge";

export default function FormSubmitButton({
  product,
  size,
  buttonRef,
  session,
}: {
  product: Product;
  size: string | null;
  buttonRef: RefObject<HTMLButtonElement>;
  session: Session | null;
}) {
  const { pending, data } = useFormStatus();
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
            <DrawerDescription>has been added to Cart</DrawerDescription>
            <div className="flex gap-2">
              <Badge variant={"secondary"}>
                {(size == "sm" && "Small") ||
                  (size == "md" && "Medium") ||
                  (size == "lg" && "Large") ||
                  (size == "xl" && "XL")}
              </Badge>
              <Badge variant={"secondary"}>
                {capitalizeFirstLetter(product.color[0])}
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
      {session?.user ? (
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
          <IoCartOutline className={`mr-3 ${pending && "hidden"}`} size={27} />
          {pending ? <Spinner size={30} /> : `Add to cart`}
        </Button>
      ) : (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              aria-label="Button"
              className={`rounded-sm w-full py-3 md:py-6 ${
                pending && "hover:cursor-progress font-semibold"
              }`}
              variant={"secondary"}
              size={"lg"}
              type="button"
            >
              <IoCartOutline
                className={`mr-3 ${pending && "hidden"}`}
                size={27}
              />
              Add to cart
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>You need to be Logged in</AlertDialogTitle>
              <AlertDialogDescription>
                To add Products to the Cart, you must be logged in first
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => router.push(`/signin?callbackUrl=${pathname}`)}
              >
                Sign in
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
