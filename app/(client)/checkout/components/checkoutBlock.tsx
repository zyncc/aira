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

export default function CheckoutBlock({
  getAddresses,
  session,
}: {
  getAddresses: UserWithAddress | null;
  session: Session | null;
}) {
  const { selectedAddress, setAddress } = useAddress();
  const [showAddress, setShowAddress] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleAddressSubmit = (formData: FormData) => {
    const zipcode = formData.get("zipcode");
    const phone = formData.get("phone");
    const zipCoderegex = /^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/;
    const phoneRegex = /^[6-9]\d{9}$/;
    const validZipcode = zipCoderegex.test(zipcode as string);
    const validPhone = phoneRegex.test(phone as string);
    if (!validZipcode) {
      toast({
        variant: "destructive",
        title: "Invalid Zip Code",
      });
    } else if (!validPhone) {
      toast({
        variant: "destructive",
        title: "Invalid Phone Number",
      });
    } else {
      createNewAddress(formData);
      setShowAddress(false);
      formRef?.current?.reset();
    }
  };

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
              ? "border-[#fbd8b4] bg-[#fcf5ee]"
              : "border-muted bg-white"
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
      {getAddresses?.address != undefined &&
        !showAddress &&
        getAddresses.address.length > 0 && (
          <Button
            variant={"link"}
            size={"sm"}
            onClick={() => setShowAddress(true)}
          >
            Add new Address
          </Button>
        )}
      {(showAddress || getAddresses?.address.length == 0) && (
        <>
          <h1 className={"font-medium text-xl"}>Add new Address</h1>
          <form
            ref={formRef}
            action={async (formData) => {
              handleAddressSubmit(formData);
            }}
            className="flex flex-col gap-4 w-full mt-3"
          >
            <input type="text" name="id" value={session?.user.id} hidden />
            <Input placeholder="Name" name="name" type="text" />
            <Input placeholder="Email" name="email" type="text" required />
            <Input
              placeholder="Phone"
              name="phone"
              type="tel"
              required
              maxLength={10}
              minLength={10}
            />
            <Input
              placeholder="Address line 1"
              name="address1"
              type="text"
              required
              minLength={30}
            />
            <Input
              placeholder="Address line 2"
              name="address2"
              type="text"
              required
              minLength={10}
            />
            <Select required name="state">
              <SelectTrigger>
                <SelectValue placeholder="Select a state" />
              </SelectTrigger>
              <SelectContent>
                {states.map((state, i) => (
                  <SelectItem value={state} key={i}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Zipcode"
              name="zipcode"
              type="text"
              required
              maxLength={6}
              minLength={6}
            />
            <Input
              placeholder="Landmark"
              name="landmark"
              type="text"
              required
            />
            <FormSubmitButton text="Add" />
          </form>
        </>
      )}
    </div>
  );
}
