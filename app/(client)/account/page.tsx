import { getServerSession } from "@/lib/getServerSession";
import prisma from "@/lib/prisma";
import type { Metadata } from "next";
import Account from "./_account";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Your Account - Aira",
};

const AccountWrapper = async () => {
  const session = await getServerSession();

  if (!session) {
    redirect("/signin?callbackUrl=/account");
  }

  const [orderCount, addressCount, getActivity] = await Promise.all([
    prisma.order.count({
      where: {
        userId: session?.user.id,
        paymentSuccess: true,
      },
    }),
    prisma.address.count({
      where: {
        userId: session?.user.id,
      },
    }),
    prisma.activity.findMany({
      where: {
        userId: session?.user.id,
      },
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  return (
    <Account
      session={session}
      orderCount={orderCount}
      addressCount={addressCount}
      getActivity={getActivity}
    />
  );
};

export default AccountWrapper;
