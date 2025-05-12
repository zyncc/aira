"use client";

import React, { useState } from "react";
import { useCheckoutStore } from "@/context/checkoutStore";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import formatCurrency from "@/lib/formatCurrency";
import Image from "next/image";
import Link from "next/link";
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
import { CreateCheckoutUser } from "@/lib/zodSchemas";
import { CreateUser, CreateUserAddress } from "@/actions/CreateNewUser";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { capitalizeFirstLetter } from "@/lib/caplitaliseFirstLetter";

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

export default function DefaultCheckout() {
  const { checkoutItems } = useCheckoutStore();
  if (checkoutItems?.length == 0) redirect("/");
  const { Razorpay } = useRazorpay();
  const [loading, setLoading] = useState(false);

  const price = checkoutItems?.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const form = useForm<z.infer<typeof CreateCheckoutUser>>({
    resolver: zodResolver(CreateCheckoutUser),
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
      emailOffers: true,
    },
  });

  async function onSubmit(values: z.infer<typeof CreateCheckoutUser>) {
    setLoading(true);
    const user = await CreateUser(values);
    const userAddress = await CreateUserAddress(values, user?.id);
    if (!userAddress) {
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
        name: userAddress.firstName,
        email: userAddress.email,
        contact: userAddress.phone,
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
    const res = await CreateOrder(products, userAddress, orderID, user?.id);
    if (res?.error) {
      toast.error(res.error, {
        duration: 6000,
      });
      setLoading(false);
      return null;
    }
    razorpayInstance.open();
  }

  return (
    <div className="flex flex-col gap-20 lg:flex-row w-full justify-end">
      <div className="flex-1 container">
        <div className="flex items-center justify-between gap-x-4">
          <h1 className="font-medium text-xl">Contact Information</h1>
          <h3 className="text-sm">
            Already have an account?{" "}
            <Link href={"/signin"}>
              <span className="underline cursor-pointer text-blue-500">
                Log in
              </span>
            </Link>
          </h3>
        </div>
        <div>
          <Form {...form}>
            <form
              id="checkoutForm"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              <div className="mt-5 space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-background rounded-[6px]"
                          placeholder="Email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-background rounded-[6px]"
                          placeholder="Phone"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="emailOffers"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <div className="flex items-center gap-3">
                        <FormControl>
                          <Checkbox
                            className="rounded-[6px]"
                            onCheckedChange={field.onChange}
                            checked={field.value}
                          />
                        </FormControl>
                        <FormLabel>
                          Notify me about new Arrivals and Offers
                        </FormLabel>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-4">
                <h1 className="font-medium text-xl">Shipping Address</h1>
                <div className="flex items-start justify-between gap-3">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input
                            className="bg-background rounded-[6px]"
                            placeholder="First Name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input
                            className="bg-background rounded-[6px]"
                            placeholder="Last Name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="address1"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Address Line 1</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-background rounded-[6px]"
                          placeholder="Address Line 1"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address2"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Address Line 2</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-background rounded-[6px]"
                          placeholder="Address Line 2"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-start justify-between gap-3">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input
                            className="bg-background rounded-[6px]"
                            placeholder="City"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="landmark"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Landmark</FormLabel>
                        <FormControl>
                          <Input
                            className="bg-background rounded-[6px]"
                            placeholder="Landmark"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex items-start justify-between gap-3">
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>State</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="rounded-[6px]">
                              <SelectValue placeholder="Select a State" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-background">
                            {states.map((state) => (
                              <SelectItem key={state} value={state}>
                                {state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="zipcode"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Zipcode</FormLabel>
                        <FormControl>
                          <Input
                            className="bg-background rounded-[6px]"
                            placeholder="Zipcode"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </form>
          </Form>
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
            <Button disabled={loading} form="checkoutForm" className="w-full">
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
