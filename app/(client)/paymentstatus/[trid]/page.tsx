import {checkPaymentStatus} from "@/actions/pay";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import {RiVerifiedBadgeFill} from "react-icons/ri";
import prisma from "@/lib/prisma";
import {notFound} from "next/navigation";
import ConfettiDecor from "@/components/confetti";
import {HoverCard, HoverCardContent, HoverCardTrigger,} from "@/components/ui/hover-card";
import {Badge} from "@/components/ui/badge";

export default async function Page({ params }: { params: { trid: string } }) {
  const checkPayment = await checkPaymentStatus(params.trid);
  const orders = await prisma.order.findFirst({
    where: {
      transactionId: params.trid,
    },
    include: {
      address: true,
    },
  });
  if (!orders) return notFound();
  return (
    <div className="container text-center flex items-center justify-center w-screen h-screen flex-col gap-5">
      {checkPayment ? (
        <>
          <div className="flex items-center gap-2">
            <RiVerifiedBadgeFill color="green" size={40} />
            <h1 className="font-semibold text-3xl text-center">
              Payment Success
            </h1>
          </div>
          <p>Transaction ID - {params.trid.split("-").pop()}</p>
          <HoverCard>
            <h1>
              Shipping Address -{" "}
              <HoverCardTrigger>
                <Badge
                  variant="secondary"
                  className="cursor-pointer hover:bg-secondary"
                >
                  {orders.address?.name}
                </Badge>
              </HoverCardTrigger>
            </h1>
            <HoverCardContent className="text-left font-medium">
              <p className="line-clamp-1">{orders.address?.address1}</p>
              <p className="line-clamp-1">{orders.address?.address2}</p>
              <p>{orders.address?.phone}</p>
              <p>{orders.address?.landmark}</p>
              <p>{orders.address?.zipcode}</p>
            </HoverCardContent>
          </HoverCard>
          <h1 className="font-semibold text-muted-foreground">
            A Copy of this has been sent to your Mail
          </h1>
          <Link href={"/account/orders"}>
            <Button variant={"secondary"}>Go to My Orders</Button>
          </Link>
        </>
      ) : (
        <>
          <h1 className="font-semibold text-3xl">PAYMENT FAILED ❌</h1>
        </>
      )}
      <ConfettiDecor />
    </div>
  );
}
