"use client";

import React, { useMemo, useState } from "react";
import { useCheckoutStore } from "@/context/checkoutStore";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import {
  Loader,
  LoaderCircle,
  MapPin,
  Package,
  Plus,
  Shield,
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
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
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createNewAddress, updateUserAddress } from "@/actions/formSubmissions";
import { UserWithAddress } from "@/lib/types";
import formatCurrency from "@/lib/formatCurrency";
import Image from "next/image";
import Link from "next/link";
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
  const [updateLoading, setUpdateLoading] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);

  const price = useMemo(() => {
    return checkoutItems?.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
  }, [checkoutItems]);

  async function handlePayButton() {
    setLoading(true);
    if (!selectedAddress) {
      toast({
        title: "Select an Address",
        variant: "destructive",
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
      toast({
        title: "Failed to Process Order",
        variant: "destructive",
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
      toast({
        title: res.error,
        variant: "destructive",
        duration: 6000,
      });
      setLoading(false);
      return null;
    }
    razorpayInstance.open();
  }

  const createForm = useForm<z.infer<typeof AddressFormSchema>>({
    resolver: zodResolver(AddressFormSchema),
  });

  const updateForm = useForm<z.infer<typeof AddressFormSchema>>({
    resolver: zodResolver(AddressFormSchema),
  });

  async function handleUpdateAddress(
    values: z.infer<typeof AddressFormSchema>
  ) {
    setUpdateLoading(true);
    await updateUserAddress(values);
    setUpdateLoading(false);
    setUpdateModalOpen(false);
  }

  async function handleCreateAddress(
    values: z.infer<typeof AddressFormSchema>
  ) {
    console.log("Create Address", values);
    setCreateLoading(true);
    await createNewAddress(values);
    setCreateLoading(false);
    setCreateModalOpen(false);
  }

  return (
    <div className="min-h-screen mt-[100px]">
      <div className="mx-auto">
        <div className="grid lg:grid-cols-12 gap-8 mx-auto">
          <div className="lg:col-span-5 space-y-6">
            <Card className="overflow-hidden">
              <div className="border-b bg-primary/5 px-6 py-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <h2 className="font-semibold">Delivery Address</h2>
                </div>
              </div>
              <CardContent className="p-6">
                <RadioGroup
                  defaultValue="home"
                  onValueChange={(val) => {
                    const selected = addresses?.address.find(
                      (address) => address.id == val
                    );
                    setSelectedAddress(selected);
                  }}
                  className="space-y-4"
                >
                  {addresses?.address.length == 0 && (
                    <h1 className="text-sm text-muted">No addresses added</h1>
                  )}
                  {addresses?.address.map((address) => (
                    <div
                      key={address.id}
                      className="flex items-center space-x-4 rounded-lg border p-4 cursor-pointer transition-colors"
                    >
                      <RadioGroupItem
                        value={address.id}
                        id={address.id}
                        onClick={() => setSelectedAddress(address)}
                      />
                      <Label
                        htmlFor={address.id}
                        className="flex-1 cursor-pointer"
                      >
                        <div className="font-medium">{address.firstName}</div>
                        <div className="text-sm text-muted mt-1">
                          {address.address1}
                          <br />
                          {`${address.landmark}, ${address.zipcode}`}
                          <br />
                          {address.phone}
                        </div>
                      </Label>
                      <Dialog
                        open={updateModalOpen}
                        onOpenChange={setUpdateModalOpen}
                      >
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Address</DialogTitle>
                          </DialogHeader>
                          <Form {...updateForm}>
                            <form
                              className="flex flex-col gap-4 mt-3"
                              onSubmit={updateForm.handleSubmit(
                                handleUpdateAddress
                              )}
                            >
                              <FormField
                                control={updateForm.control}
                                defaultValue={address.id}
                                name="id"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <input type="text" hidden {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={updateForm.control}
                                defaultValue={address.firstName}
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
                                control={updateForm.control}
                                defaultValue={address.lastName}
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
                                control={updateForm.control}
                                defaultValue={address.email}
                                name="email"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Email"
                                        type="text"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={updateForm.control}
                                defaultValue={address.phone}
                                name="phone"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Phone</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Phone"
                                        type="tel"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={updateForm.control}
                                name="address1"
                                defaultValue={address.address1}
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
                                control={updateForm.control}
                                defaultValue={address.address2}
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
                                control={updateForm.control}
                                defaultValue={address.city}
                                name="city"
                                render={({ field }) => (
                                  <FormItem>
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
                                control={updateForm.control}
                                defaultValue={address.state}
                                name="state"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>State</FormLabel>
                                    <FormControl>
                                      <Select required {...field}>
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
                                control={updateForm.control}
                                defaultValue={address.zipcode}
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
                                control={updateForm.control}
                                defaultValue={address.landmark}
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
                              <Button type="submit" disabled={updateLoading}>
                                {updateLoading && (
                                  <LoaderCircle className="animate-spin" />
                                )}
                                Update
                              </Button>
                            </form>
                          </Form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  ))}
                </RadioGroup>
                <Dialog
                  open={createModalOpen}
                  onOpenChange={setCreateModalOpen}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" className="mt-4 gap-2">
                      <Plus className="w-4 h-4" />
                      Add New Address
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Address</DialogTitle>
                    </DialogHeader>
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
                                <Input
                                  placeholder="Email"
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
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Phone"
                                  type="tel"
                                  {...field}
                                />
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
                        <Button type="submit" disabled={createLoading}>
                          {createLoading && (
                            <LoaderCircle className="animate-spin" />
                          )}
                          Add
                        </Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
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
                  {checkoutItems?.map((item) => (
                    <div key={item.id} className="flex gap-4">
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
                        <p className="text-sm text-muted">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-sm text-muted">
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
                    <span className="text-sm text-muted">Subtotal</span>
                    <span className="font-medium">
                      {formatCurrency(price as number).split(".")[0]}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted">Shipping</span>
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
                  disabled={loading}
                  className="w-full mt-6 gap-2"
                  onClick={handlePayButton}
                >
                  {loading ? (
                    <Loader className="animate-spin" />
                  ) : (
                    `Place Order`
                  )}
                </Button>
                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted">
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
