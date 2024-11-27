"use client";

import React, {useMemo, useState} from "react";
import {useCheckoutStore} from "@/context/checkoutStore";
import formatCurrency from "@/lib/formatCurrency";
import {redirect} from "next/navigation";
import {Button} from "@/components/ui/button";
import {SiPhonepe} from "react-icons/si";
import {useAddress} from "@/context/address";
import {toast} from "@/components/ui/use-toast";
import {Pay} from "@/actions/pay";
import {SubmitPayButton} from "@/components/submitButton";
import {Separator} from "@/components/ui/separator";

export default function PriceSummary() {
  const { checkoutItems } = useCheckoutStore();
  const [showDetail, setShowDetail] = useState(false);

  const price = useMemo(() => {
    return checkoutItems?.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
  }, [checkoutItems]);
  if (checkoutItems?.length == 0) redirect("/");
  const { selectedAddress } = useAddress();

  async function handlePayButton() {
    if (!selectedAddress) {
      toast({
        title: "Select an Address",
        variant: "destructive",
      });
      return null;
    }
    const products = checkoutItems?.map((item) => {
      return { item: item.product, quantity: item.quantity, size: item.size };
    });
    await Pay(products, selectedAddress);
  }

  return (
    <div className="flex-1">
      <h1 className={"font-medium text-2xl"}>Checkout</h1>
      <div className="flex justify-between flex-col my-1">
        <div className="flex mt-3 justify-between items-center">
          <div className={"flex items-center"}>
            <h1 className="font-medium">Subtotal</h1>
            {!showDetail ? (
              <Button
                size={"sm"}
                variant={"link"}
                onClick={() => setShowDetail(true)}
              >
                View details
              </Button>
            ) : (
              <Button
                size={"sm"}
                variant={"link"}
                onClick={() => setShowDetail(false)}
              >
                Hide details
              </Button>
            )}
          </div>
          <p className="font-medium">
            {formatCurrency(price ?? 0).split(".")[0]}
          </p>
        </div>
        {showDetail && (
          <div className={"w-full flex items-end flex-col"}>
            {checkoutItems?.map((item, index) => (
              <div key={item.productId} className="font-medium">
                {formatCurrency(item.product.price).split(".")[0]} x{" "}
                {item.quantity} ={" "}
                {
                  formatCurrency(item.product.price * item.quantity).split(
                    "."
                  )[0]
                }
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-x-10 mt-3 justify-between">
          <h1 className="font-medium">Estimated Delivery</h1>
          <p className="font-medium">Free</p>
        </div>
        <Separator className="my-3" />
        <div className="flex gap-x-10 justify-between">
          <h1 className="font-medium">Total</h1>
          <p className="font-medium">
            {formatCurrency(price ?? 0).split(".")[0]}
          </p>
        </div>
        <Separator className="my-3" />
      </div>
      <div className="flex items-center"></div>
      <div className={"flex flex-col justify-center items-center"}>
        <form action={handlePayButton} className={"w-full"}>
          <SubmitPayButton />
        </form>
        <div className="flex items-center justify-center gap-1 mt-3">
          <h1 className={"text-sm text-muted-foreground text-center"}>
            Checkout Securely using
          </h1>
          <SiPhonepe size={20} color={"purple"} />
          <h1 className={"text-sm text-muted-foreground text-center"}>
            PhonePe
          </h1>
        </div>
      </div>
    </div>
  );
}
