"use client";

import React, { useState } from "react";
import { useCheckoutStore } from "@/context/checkoutStore";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader, Package, Shield, User2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
      key: process.env.RAZORPAY_KEY_ID as string,
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
          ? `http://localhost:3000/account/orders`
          : `https://pansy.in/account/orders`,
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
    <div className="min-h-screen mt-[100px]">
      <div className="mx-auto">
        <div className="grid lg:grid-cols-12 gap-8 mx-auto">
          <div className="lg:col-span-5 space-y-6">
            <Card className="overflow-hidden">
              <div className="border-b bg-primary/5 px-6 py-4">
                <div className="flex items-center gap-2">
                  <User2 className="w-5 h-5 text-primary" />
                  <h2 className="font-semibold">Enter your Details</h2>
                </div>
              </div>
              <CardContent className="p-6">
                <h1 className="font-medium mb-5">
                  Already have an Account?{" "}
                  <Link href={"/signin"} className="text-primary underline">
                    Log in
                  </Link>
                </h1>
                <Form {...form}>
                  <form
                    id="userInfoForm"
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <div className="flex gap-3 items-start justify-between">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="First Name" {...field} />
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
                              <Input placeholder="Last Name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="Phone" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <h2 className="font-semibold">
                      Enter your Address Information
                    </h2>
                    <FormField
                      control={form.control}
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
                      control={form.control}
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
                    <div className="flex gap-3 items-start justify-between">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="City"
                                type="text"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Select
                                autoComplete="state"
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
                    </div>
                    <div className="flex gap-3 items-start justify-between">
                      <FormField
                        control={form.control}
                        name="zipcode"
                        render={({ field }) => (
                          <FormItem className="flex-1">
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
                        control={form.control}
                        name="landmark"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Landmark</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                autoComplete="landmark"
                                placeholder="Landmark"
                                type="text"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-7 space-y-6">
            <Card>
              <div className="border-b rounded-tl-sm rounded-tr-sm bg-primary/5 px-6 py-4">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  <h2 className="font-semibold">Order Summary</h2>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {checkoutItems?.map((item, i) => (
                    <div key={item.product.id} className="flex gap-4">
                      <Link
                        href={`/${item.product.category}/${item.product.id}`}
                      >
                        <Image
                          src={item.product.images[0]}
                          width={96}
                          height={96}
                          priority
                          fetchPriority="high"
                          quality={90}
                          alt="Product image"
                          className="object-cover rounded-lg aspect-square"
                        />
                      </Link>
                      <div className="flex-1">
                        <h3 className="font-medium">{item.product.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Size:{" "}
                          {item.size == "sm"
                            ? "Small"
                            : item.size == "md"
                              ? "Medium"
                              : item.size == "lg"
                                ? "Large"
                                : "XL"}
                        </p>
                        <p className="text-sm font-medium mt-1">
                          {formatCurrency(item.product.price).split(".")[0]}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <Separator className="my-6" />
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Subtotal
                    </span>
                    <span className="font-medium">
                      {formatCurrency(price as number).split(".")[0]}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Shipping
                    </span>
                    <span className="text-sm text-green-600">Free</span>
                  </div>
                </div>
                <Separator className="my-6" />
                <div className="flex justify-between items-center">
                  <span className="text-base font-semibold">Total</span>
                  <span className="text-lg font-semibold">
                    {formatCurrency(price as number).split(".")[0]}
                  </span>
                </div>
                <Button
                  form="userInfoForm"
                  disabled={loading}
                  className="w-full mt-6 gap-2"
                >
                  {loading ? (
                    <Loader className="animate-spin" />
                  ) : (
                    `Place Order`
                  )}
                </Button>
                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4" />
                  <span>Secure Checkout with Razorpay</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
