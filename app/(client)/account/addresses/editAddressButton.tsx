"use client";

import {updateUserAddress} from "@/actions/formSubmissions";
import Spinner from "@/components/loadingSpinner";
import {Button} from "@/components/ui/button";
import {Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger,} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {address} from "@prisma/client";
import React from "react";
import {useFormStatus} from "react-dom";

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

export default function EditAddressButton({ address }: { address: address }) {
  const { pending } = useFormStatus();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"link"}>Edit</Button>
      </DialogTrigger>
      <DialogContent className="w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Address</DialogTitle>
        </DialogHeader>
        <form
          action={(formData) => {
            updateUserAddress(formData);
          }}
          className="flex flex-col gap-4 w-full mt-3"
        >
          <input type="text" name="addressId" value={address.id} hidden />
          <Label>Name</Label>
          <Input
            placeholder="Name"
            name="name"
            type="text"
            defaultValue={address.name}
          />
          <Label>Email</Label>
          <Input
            placeholder="Email"
            name="email"
            type="text"
            required
            defaultValue={address.email}
          />
          <Label>Phone</Label>
          <Input
            placeholder="Phone"
            name="phone"
            type="tel"
            required
            maxLength={10}
            minLength={10}
            defaultValue={address.phone}
          />
          <Label>Address 1</Label>
          <Input
            placeholder="Address line 1"
            name="address1"
            type="text"
            required
            minLength={30}
            defaultValue={address.address1}
          />
          <Label>Address 2</Label>
          <Input
            placeholder="Address line 2"
            name="address2"
            type="text"
            required
            minLength={10}
            defaultValue={address.address2}
          />
          <Label>State</Label>
          <select
            name="state"
            defaultValue={address.state}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none   disabled:cursor-not-allowed disabled:opacity-50"
          >
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          <Label>Zipcode</Label>
          <Input
            placeholder="Zipcode"
            name="zipcode"
            type="text"
            required
            maxLength={6}
            minLength={6}
            defaultValue={address.zipcode}
          />
          <Label>Landmark</Label>
          <Input
            placeholder="Landmark"
            name="landmark"
            type="text"
            required
            defaultValue={address.landmark}
          />
          <DialogClose asChild>
            <Button aria-label="Button" type="submit" disabled={pending}>
              {pending ? <Spinner size={30} /> : "Edit"}
            </Button>
          </DialogClose>
        </form>
      </DialogContent>
    </Dialog>
  );
}
