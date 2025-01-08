"use client";

import {createNewAddress} from "@/actions/formSubmissions";
import {Session} from "@/auth";
import Spinner from "@/components/loadingSpinner";
import {AlertDialogHeader} from "@/components/ui/alert-dialog";
import {Button} from "@/components/ui/button";
import {Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger,} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {toast} from "@/components/ui/use-toast";
import React, {useRef} from "react";
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

export default function CreateNewAddressButton({
  session,
}: {
  session: Session;
}) {
  const { pending } = useFormStatus();
  const closeBtn = useRef<HTMLButtonElement>(null);
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
      closeBtn.current?.click();
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          className="flex-1 min-w-[270px] p-5 rounded-md text-wrap outline-dashed outline-2 outline-black h-[250px] text-lg"
        >
          Add new Address
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[500px]">
        <AlertDialogHeader>
          <DialogTitle>Create new Address</DialogTitle>
        </AlertDialogHeader>
        <form
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
          <select
            defaultValue={""}
            name="state"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none   disabled:cursor-not-allowed disabled:opacity-50"
          >
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          <Input
            placeholder="Zipcode"
            name="zipcode"
            type="text"
            required
            maxLength={6}
            minLength={6}
          />
          <Input placeholder="Landmark" name="landmark" type="text" required />
          <Button aria-label="Button" type="submit" disabled={pending}>
            {pending ? <Spinner size={30} /> : "Add"}
          </Button>
          <DialogClose asChild>
            <button type="button" hidden ref={closeBtn}></button>
          </DialogClose>
        </form>
      </DialogContent>
    </Dialog>
  );
}
