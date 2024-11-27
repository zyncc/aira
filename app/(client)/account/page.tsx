import {redirect} from "next/navigation";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import getSession from "@/lib/getSession";
import {capitalizeFirstLetter} from "@/lib/caplitaliseFirstLetter";
import {FiBox} from "react-icons/fi";
import {LiaAddressCardSolid} from "react-icons/lia";

const Account = async () => {
  const session = await getSession();
  if (!session?.user) {
    redirect(`/signin?callbackUrl=/account`);
  }
  return (
    <div className="pt-[40px]">
      <div className="container flex items-center flex-col">
        <Image
          src={session.user.image || "/user.png"}
          width={200}
          height={200}
          priority
          className="rounded-full"
          alt="Profile Picture"
          quality={100}
        />
        <h1 className="font-semibold text-3xl mt-2">
          {capitalizeFirstLetter(session?.user.name?.toLowerCase() ?? "")}
        </h1>
        <div className="flex gap-4 mt-5 flex-wrap items-center justify-center ">
          <Link href={"/account/orders"}>
            <div className="cursor-pointer bg-secondary rounded-lg p-5 flex items-center gap-x-3">
              <FiBox size={35} />
              <h1 className="font-medium text-xl">Your Orders</h1>
            </div>
          </Link>
          <Link href={"/account/addresses"}>
            <div className="cursor-pointer bg-secondary rounded-lg p-5 flex items-center gap-x-3">
              <LiaAddressCardSolid size={35} />
              <h1 className="font-medium text-xl">Your Addresses</h1>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Account;
