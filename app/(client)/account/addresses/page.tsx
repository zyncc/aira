import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import React from "react";
import DeleteAddressButton from "./deleteAddressButton";
import CreateNewAddressButton from "./createNewAddressButton";
import EditAddressButton from "./editAddressButton";
import { headers } from "next/headers";
import { auth } from "@/auth";

const states = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

export default async function Page() {
  const session = await auth.api.getSession({
    headers: headers(),
  });
  if (!session?.user) {
    redirect("/signin?callbackUrl=/account/addresses");
  }
  const addresses = await prisma.address.findMany({
    where: {
      userId: session?.user.id,
    },
  });

  return (
    <div className="container my-10">
      <h1 className="text-xl font-medium">Your Addresses</h1>
      <div className="mt-5 flex gap-6 flex-wrap items-stretch h-fit">
        {addresses.map((address) => (
          <div
            key={address.id}
            className="flex-1 min-w-[270px] bg-secondary p-5 rounded-md text-wrap w-[300px] overflow-hidden relative"
          >
            <h1>{address.name}</h1>
            <h1>{address.address1}</h1>
            <h1>{address.address2}</h1>
            <h1>{address.landmark}</h1>
            <h1>{address.state}</h1>
            <h1>{address.zipcode}</h1>
            <div className="absolute right-3 bottom-3">
              <EditAddressButton address={address} />
              <DeleteAddressButton addressId={address.id} />
            </div>
          </div>
        ))}
        <CreateNewAddressButton session={session} />
      </div>
    </div>
  );
}
