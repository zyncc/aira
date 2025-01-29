"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import formatCurrency from "@/lib/formatCurrency";
import { z } from "zod";
import { addToCart } from "@/actions/action";
import { useToast } from "@/components/ui/use-toast";
import { Products } from "@/lib/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { TbTruckDelivery } from "react-icons/tb";
import { BiTransferAlt } from "react-icons/bi";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { IoMdInformationCircleOutline } from "react-icons/io";
import AddToCartBtn from "./AddToCartBtn";
import { Session } from "@/auth";
import BuyButton from "./buyButton";

type Props = {
  product: Products;
  session: Session | null;
};

const sizeScheme = z.object({
  size: z.enum(["sm", "md", "lg", "xl"]),
  quantity: z.number().gt(0),
});

export default function RightPage({ product, session }: Props) {
  const { toast } = useToast();
  const [size, setSize] = useState<string>();
  const { title, description, price, quantity, id, category, images } = product;
  const formatted = formatCurrency(price);
  const [date, setDate] = useState<Date>();

  useEffect(() => {
    var currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 3);
    setDate(currentDate);
  }, []);
  const buttonRef = useRef<HTMLButtonElement>(null);

  async function handleAddToCart() {
    if (size == "sm") {
      const validation = sizeScheme.safeParse({
        size: size,
        quantity: product.quantity?.sm,
      });
      if (!validation.success) {
        toast({
          variant: "destructive",
          title: "Please select a size to continue",
        });
        return null;
      }
    } else if (size == "md") {
      const validation = sizeScheme.safeParse({
        size: size,
        quantity: product.quantity?.md,
      });
      if (!validation.success) {
        toast({
          variant: "destructive",
          title: "Please select a size to continue",
        });
        return null;
      }
    } else if (size == "lg") {
      const validation = sizeScheme.safeParse({
        size: size,
        quantity: product.quantity?.lg,
      });
      if (!validation.success) {
        toast({
          variant: "destructive",
          title: "Please select a size to continue",
        });
        return null;
      }
    } else if (size == "xl") {
      const validation = sizeScheme.safeParse({
        size: size,
        quantity: product.quantity?.xl,
      });
      if (!validation.success) {
        toast({
          variant: "destructive",
          title: "Please select a size to continue",
        });
        return null;
      }
    } else {
      const validation = sizeScheme.safeParse({
        size: size,
      });
      if (!validation.success) {
        toast({
          variant: "destructive",
          title: "Please select a size to continue",
        });
        return null;
      }
    }
    if (size) {
      await addToCart(id, size);
      buttonRef.current?.click();
    }
  }

  return (
    <div className="md:basis-1/2 flex flex-col gap-3 container">
      {session?.user.role === "admin" ? (
        <Link href={"/admin/products/" + product.id}>
          <h1 className="text-3xl font-semibold">
            {title.slice(0, 24)}
            {title.length > 24 && "..."}
          </h1>
        </Link>
      ) : (
        <h1 className="text-3xl font-semibold">{title}</h1>
      )}
      <h1 className="text-xl font-medium">{formatted.split(".")[0]}</h1>
      <div className="flex flex-col md:items-center md:flex-row gap-6">
        <div className="flex-1">
          <form
            action={handleAddToCart}
            className="flex flex-col items-start gap-4"
          >
            {quantity?.sm == 0 &&
            quantity?.md == 0 &&
            quantity?.lg == 0 &&
            quantity?.xl == 0 ? (
              <></>
            ) : (
              <h1>Select a size</h1>
            )}
            <div className="flex gap-6 items-start mb-2 overflow-hidden flex-wrap">
              <div className="flex items-start justify-start gap-2 flex-wrap">
                {quantity?.sm !== 0 && (
                  <span className="flex items-center text-red-500 flex-col gap-2">
                    <Button
                      size={"lg"}
                      variant={size == "sm" ? "default" : "outline"}
                      type="button"
                      onClick={() => {
                        setSize("sm");
                      }}
                      className={`flex flex-col text-lg text-black border-2 ${
                        size == "sm" && "border-2 border-primary"
                      }`}
                    >
                      S
                    </Button>
                    {quantity && quantity?.sm < 5 && (
                      <span>{quantity?.sm} left</span>
                    )}
                  </span>
                )}
                {quantity?.md !== 0 && (
                  <span className="flex items-center text-red-500 flex-col gap-2">
                    <Button
                      size={"lg"}
                      variant={size == "md" ? "default" : "outline"}
                      type="button"
                      onClick={() => {
                        setSize("md");
                      }}
                      className={`flex flex-col text-lg border-2 text-black ${
                        size == "md" && "border-2 border-primary"
                      }`}
                    >
                      M
                    </Button>
                    {quantity && quantity?.md < 5 && (
                      <span>{quantity?.md} left</span>
                    )}
                  </span>
                )}
                {quantity?.lg !== 0 && (
                  <span className="flex items-center text-red-500 flex-col gap-2">
                    <Button
                      size={"lg"}
                      variant={size == "lg" ? "default" : "outline"}
                      type="button"
                      onClick={() => {
                        setSize("lg");
                      }}
                      className={`flex flex-col text-lg border-2 text-black ${
                        size == "lg" && "border-2 border-primary"
                      }`}
                    >
                      L
                    </Button>
                    {quantity && quantity?.lg < 5 && (
                      <span>{quantity?.lg} left</span>
                    )}
                  </span>
                )}
                {quantity?.xl !== 0 && (
                  <span className="flex items-center text-red-500 flex-col gap-2">
                    <Button
                      size={"lg"}
                      variant={size == "xl" ? "default" : "outline"}
                      type="button"
                      onClick={() => {
                        setSize("xl");
                      }}
                      className={`flex flex-col text-lg border-2 text-black ${
                        size == "xl" && "border-2 border-primary"
                      }`}
                    >
                      XL
                    </Button>
                    {quantity && quantity?.xl < 5 && (
                      <span>{quantity?.xl} left</span>
                    )}
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-4 w-full flex-wrap flex-col md:flex-row">
              {quantity?.sm == 0 &&
              quantity?.md == 0 &&
              quantity?.lg == 0 &&
              quantity?.xl == 0 ? (
                <Button
                  disabled
                  aria-label="Button"
                  className="flex-1 rounded-sm py-3 md:py-6"
                  variant={"outline"}
                  size={"lg"}
                >
                  Out of stock
                </Button>
              ) : (
                <BuyButton
                  product={product}
                  cartItemInfo={{ size: size!, quantity: 1 }}
                  session={session}
                />
              )}
              {quantity?.sm == 0 &&
              quantity?.md == 0 &&
              quantity?.lg == 0 &&
              quantity?.xl == 0 ? (
                <Button
                  disabled
                  aria-label="Button"
                  className="flex-1 rounded-sm py-3 md:py-6"
                  variant={"outline"}
                  size={"lg"}
                >
                  Out of stock
                </Button>
              ) : (
                <AddToCartBtn
                  session={session}
                  product={product}
                  size={size!}
                  buttonRef={buttonRef}
                />
              )}
            </div>
          </form>
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-4 w-fit text-gray-600">
        <div className="flex gap-5 items-center">
          <TbTruckDelivery size={30} />
          <div>
            Expected delivery by{" "}
            <span className="font-semibold">
              {date?.toString().slice(0, 11)}
            </span>{" "}
            <br />
            Free delivery
          </div>
        </div>
        <div className="flex gap-5 items-center">
          <VscWorkspaceTrusted size={28} />
          <div>100% Genuine Product</div>
        </div>
        <div className="flex gap-5 items-center">
          <BiTransferAlt size={30} />
          <div>
            Hassle free 7 days Exchange <br />
            No Return
          </div>
        </div>
      </div>
      <div className="mt-4 flex font-semibold items-center gap-2">
        <IoMdInformationCircleOutline size={27} />
        Product Details
      </div>
      <div className="border-2 rounded-lg p-3 ">
        <div className="grid grid-cols-2 gap-y-5">
          <div>
            <h1 className="font-semibold">Fabric</h1>
            <p className="text-foreground">{product.fabric}</p>
          </div>
          <div>
            <h1 className="font-semibold">Transparency</h1>
            <p className="text-foreground">{product.transparency}</p>
          </div>
          <div>
            <h1 className="font-semibold">Weave Pattern</h1>
            <p className="text-foreground">{product.weavePattern}</p>
          </div>
          <div>
            <h1 className="font-semibold">Fit</h1>
            <p className="text-foreground">{product.fit}</p>
          </div>
        </div>
        <div className="mt-5">
          <h1 className="font-semibold">Description</h1>
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
}
