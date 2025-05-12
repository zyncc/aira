"use client";

import React, { useState } from "react";
import { useCheckoutStore } from "@/context/checkoutStore";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, LoaderCircle, PlusIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createNewAddress } from "@/actions/formSubmissions";
import { UserWithAddress } from "@/lib/types";
import formatCurrency from "@/lib/formatCurrency";
import Image from "next/image";
import { address } from "@prisma/client";
import { CreateRazorpayOrder } from "@/actions/razorpay.createOrder";
import { RazorpayOrderOptions, useRazorpay } from "react-razorpay";
import { CreateOrder } from "@/actions/CreateOrder";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AddressFormSchema } from "@/lib/zodSchemas";
import { toast } from "sonner";
import { capitalizeFirstLetter } from "@/lib/caplitaliseFirstLetter";
import { Checkbox } from "@/components/ui/checkbox";

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

export default function PriceSummary({
  addresses,
}: {
  addresses: UserWithAddress | null;
}) {
  const { checkoutItems } = useCheckoutStore();
  if (checkoutItems?.length == 0) redirect("/");
  const { Razorpay } = useRazorpay();
  const [selectedAddress, setSelectedAddress] = useState<address>();
  const [loading, setLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const price = checkoutItems?.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  async function handlePayButton() {
    setLoading(true);
    if (!selectedAddress) {
      toast.error("Select an Address", {
        duration: 3000,
      });
      setLoading(false);
      return null;
    }
    const products = checkoutItems?.map((item) => {
      return {
        productWithQuantity: item.product,
        quantity: item.quantity,
        size: item.size,
      };
    });
    const orderID: string | null = await CreateRazorpayOrder(products);
    if (!orderID) {
      toast.error("Failed to Process Order", {
        duration: 3000,
      });
      return null;
    }
    const options: RazorpayOrderOptions = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
      amount: price! * 100,
      currency: "INR",
      name: "Aira",
      order_id: orderID,
      modal: {
        backdropclose: false,
        escape: false,
        handleback: false,
        confirm_close: true,
        animation: true,
        ondismiss() {
          setLoading(false);
        },
      },
      callback_url:
        process.env.NODE_ENV == "development"
          ? `http://localhost:3000/success?orderId=${orderID}`
          : `https://airaclothing.in/success?orderId=${orderID}`,
      prefill: {
        name: selectedAddress.firstName,
        email: selectedAddress.email,
        contact: selectedAddress.phone,
      },
      allow_rotation: false,
      retry: {
        enabled: true,
      },
      remember_customer: true,
      theme: {
        hide_topbar: false,
      },
    };
    const razorpayInstance = new Razorpay(options);
    const res = await CreateOrder(products, selectedAddress, orderID);
    if (res?.error) {
      toast(res.error, {
        duration: 6000,
      });
      setLoading(false);
      return null;
    }
    razorpayInstance.open();
  }

  const createForm = useForm<z.infer<typeof AddressFormSchema>>({
    resolver: zodResolver(AddressFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      landmark: "",
      zipcode: "",
    },
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
    <div className="flex flex-col h-full gap-20 lg:flex-row w-full justify-end">
      <div className="flex-1 container">
        <h2 className="text-lg font-medium mb-4">Select an Address</h2>
        <div className="space-y-5">
          {addresses?.address.map((address) => (
            <div
              key={address.id}
              className="border-input has-data-[state=checked]:border-ring relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none"
            >
              <Checkbox
                id={address.id}
                checked={selectedAddress?.id === address.id}
                onCheckedChange={() => setSelectedAddress(address)}
                className="order-1 after:absolute after:inset-0 rounded-[6px]"
              />
              <div className="grid grow gap-2">
                <Label htmlFor={address.id}>{address.firstName}</Label>
                <p className="text-muted text-sm">
                  {address.address1}, {address.address2}, {address.landmark},{" "}
                  {address.city}, {address.state}, {address.zipcode} <br />
                  {address.phone}
                </p>
              </div>
            </div>
          ))}
          <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusIcon className="!w-4 !h-4" /> Create address
              </Button>
            </DialogTrigger>
            <DialogContent className="flex flex-col gap-0 p-0 sm:max-h-[min(640px,80vh)] sm:max-w-lg">
              <DialogHeader className="p-4 border-b">
                <DialogTitle>Create Address</DialogTitle>
              </DialogHeader>
              <div className="overflow-y-scroll px-4 pb-5">
                <Form {...createForm}>
                  <form
                    id="createAddressForm"
                    className="flex flex-col gap-4 mt-3"
                    onSubmit={createForm.handleSubmit((values) => {
                      console.log("Form values: ", values);
                      handleCreateAddress(values);
                    })}
                  >
                    <FormField
                      control={createForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="First Name"
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
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Last Name"
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
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="City" type="text" {...field} />
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
                              {...field}
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select a state" />
                              </SelectTrigger>
                              <SelectContent className="bg-background">
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
                            <Input
                              {...field}
                              placeholder="Zipcode"
                              type="text"
                            />
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
                            <Input
                              {...field}
                              placeholder="Landmark"
                              type="text"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </div>
              <DialogFooter className="p-4 border-t">
                <DialogClose asChild>
                  <Button variant="outline" className="flex-1">
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  form="createAddressForm"
                  className="flex-1"
                  type="submit"
                  disabled={createLoading}
                >
                  {createLoading && <LoaderCircle className="animate-spin" />}
                  Add
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="flex-1 container lg:border-l">
        <div className="flex flex-col gap-5">
          {checkoutItems?.map((item) => (
            <div
              key={item.product.id}
              className="flex items-start justify-between max-w-fit gap-x-5"
            >
              <div className="relative">
                <Image
                  src={item.product.images[0]}
                  alt={item.product.title}
                  width={60}
                  height={60}
                  priority
                  placeholder="blur"
                  blurDataURL={item.product.placeholderImages[0]}
                  className="object-cover aspect-square rounded-lg"
                />
                <div className="absolute -top-2 -right-1 bg-white rounded-full w-6 h-6 flex items-center justify-center">
                  {item.quantity}
                </div>
              </div>
              <div className="flex flex-col">
                <h1>{item.product.title}</h1>
                <h1>{capitalizeFirstLetter(item.product.color)}</h1>
              </div>
              <h2 className="font-medium">
                Rs. {formatCurrency(item.product.price)}
              </h2>
            </div>
          ))}
        </div>
        <Separator className="my-5" />
        <div className="flex justify-between flex-col">
          <div className="flex w-full justify-between">
            <h3 className="font-medium">Subtotal</h3>
            <h3 className="font-medium">Rs. {formatCurrency(price!)}</h3>
          </div>
          <div className="flex w-full justify-between mt-2">
            <h1 className="font-medium">Shipping</h1>
            <h1 className="font-medium">Free</h1>
          </div>
          <Separator className="my-5" />
          <div className="flex justify-between">
            <h2 className="text-lg font-medium">Total</h2>
            <h3 className="text-lg font-medium">
              Rs. {formatCurrency(price!)}
            </h3>
          </div>
          <div className="space-y-4 mt-5">
            <Button
              disabled={loading}
              onClick={handlePayButton}
              className="w-full"
            >
              {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
              Checkout
            </Button>
            <p className="text-xs font-light text-muted text-center">
              Secure Checkout with Razorpay
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
