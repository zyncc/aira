"use client";

import React, { useRef, useState } from "react";
import { UserWithAddress } from "@/lib/types";
import { useAddress } from "@/context/address";
import { Button } from "@/components/ui/button";
import FormSubmitButton from "@/components/FormSubmitButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { createNewAddress } from "@/actions/formSubmissions";
import { toast } from "@/components/ui/use-toast";
import { Session } from "@/auth";

export default function CheckoutBlock({
  getAddresses,
  session,
}: {
  getAddresses: UserWithAddress | null;
  session: Session | null;
}) {
  const { selectedAddress, setAddress } = useAddress();

  return (
    <div className={"flex-1"}>
      {getAddresses?.address != undefined &&
        getAddresses.address.length > 0 && (
          <h1 className={"font-medium text-xl"}>Select an Address</h1>
        )}
      {getAddresses?.address.map((address) => (
        <div
          key={address.id}
          className={`my-4 border-2 rounded-lg p-3 w-full cursor-pointer ${
            selectedAddress?.id == address.id
              ? "bg-[#dcf7ea]"
              : "border-muted bg-[#f9fbfa]"
          }`}
          onClick={() => setAddress(address)}
        >
          <h1 className={"font-medium line-clamp-1"}>{address.name}</h1>
          <h1 className={"line-clamp-1"}>{address.address1}</h1>
          <h1 className={"line-clamp-1"}>{address.address2}</h1>
          <h1 className={"line-clamp-1"}>{address.landmark}</h1>
          <h1 className={"line-clamp-1"}>{address.state}</h1>
          <h1 className={"line-clamp-1"}>{address.phone}</h1>
        </div>
      ))}
    </div>
  );
}
