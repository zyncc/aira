"use client";

import { createNewAddress } from "@/actions/formSubmissions";
import { AlertDialogHeader } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { LoaderCircle, PlusCircle } from "lucide-react";
import React, { useRef, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AddressFormSchema } from "@/lib/zodSchemas";

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

export default function CreateNewAddressButton() {
  const closeBtn = useRef<HTMLButtonElement>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  const createForm = useForm<z.infer<typeof AddressFormSchema>>({
    resolver: zodResolver(AddressFormSchema),
  });

  async function handleCreateAddress(
    values: z.infer<typeof AddressFormSchema>
  ) {
    setCreateLoading(true);
    await createNewAddress(values);
    setCreateLoading(false);
    setCreateModalOpen(false);
  }
  return (
    <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
      <DialogTrigger asChild>
        <Button className="mt-6 gap-2">
          <PlusCircle className="w-4 h-4" />
          Add address
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[500px]">
        <AlertDialogHeader>
          <DialogTitle>Create new Address</DialogTitle>
        </AlertDialogHeader>
        <Form {...createForm}>
          <form
            className="flex flex-col gap-4 mt-3"
            onSubmit={createForm.handleSubmit((values) => {
              console.log("Form values: ", values);
              handleCreateAddress(values);
            })}
          >
            <FormField
              control={createForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={createForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={createForm.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Phone" type="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={createForm.control}
              name="address1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address line 1</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Address line 1"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={createForm.control}
              name="address2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address line 2</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Address line 2"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={createForm.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Select
                      required
                      {...field}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
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
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={createForm.control}
              name="zipcode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zipcode</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Zipcode" type="text" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={createForm.control}
              name="landmark"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Landmark</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Landmark" type="text" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={createLoading}>
              {createLoading && <LoaderCircle className="animate-spin" />}
              Add
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
