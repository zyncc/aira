"use client";

import React, { useMemo, useRef, useState } from "react";
import { useCheckoutStore } from "@/context/checkoutStore";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import {
  ArrowRight,
  Loader,
  MapPin,
  Package,
  Plus,
  Shield,
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import FormSubmitButton from "@/components/FormSubmitButton";
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
  DialogClose,
} from "@/components/ui/dialog";
import { createNewAddress } from "@/actions/formSubmissions";
import { Session } from "@/auth";
import { UserWithAddress } from "@/lib/types";
import formatCurrency from "@/lib/formatCurrency";
import Image from "next/image";
import Link from "next/link";
import { address } from "@prisma/client";
import { CreateRazorpayOrder } from "@/actions/razorpay.createOrder";
import { RazorpayOrderOptions, useRazorpay } from "react-razorpay";
import { CreateOrder } from "@/actions/CreateOrder";

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
  session,
}: {
  addresses: UserWithAddress | null;
  session: Session | null;
}) {
  const { checkoutItems } = useCheckoutStore();
  if (checkoutItems?.length == 0) redirect("/");
  const { Razorpay } = useRazorpay();
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedAddress, setSelectedAddress] = useState<address>();
  const [loading, setLoading] = useState(false);

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
    // await Pay(products, selectedAddress);
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
          : `https://airaa.vercel.app/account/orders`,
      prefill: {
        name: selectedAddress.name,
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
      formRef?.current?.reset();
    }
  };

  return (
    <div className="min-h-screen mt-[100px] bg-gray-50/50">
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
                  {addresses?.address.map((address) => (
                    <div
                      key={address.id}
                      className="flex items-center space-x-4 rounded-lg border p-4 cursor-pointer hover:bg-gray-50 transition-colors"
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
                        <div className="font-medium">{address.name}</div>
                        <div className="text-sm text-muted mt-1">
                          {address.address1}
                          <br />
                          {`${address.landmark}, ${address.zipcode}`}
                          <br />
                          {address.phone}
                        </div>
                      </Label>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Address</DialogTitle>
                          </DialogHeader>
                          <form
                            ref={formRef}
                            action={async (formData) => {
                              handleAddressSubmit(formData);
                            }}
                            className="flex flex-col gap-4 min-w-[40vw] mt-3"
                          >
                            <input
                              type="text"
                              name="id"
                              value={session?.user.id}
                              hidden
                            />
                            <Input
                              placeholder="Name"
                              name="name"
                              type="text"
                              defaultValue={address.name}
                            />
                            <Input
                              placeholder="Email"
                              name="email"
                              type="text"
                              defaultValue={address.email}
                              required
                            />
                            <Input
                              placeholder="Phone"
                              name="phone"
                              type="tel"
                              required
                              maxLength={10}
                              minLength={10}
                              defaultValue={address.phone}
                            />
                            <Input
                              placeholder="Address line 1"
                              name="address1"
                              type="text"
                              required
                              minLength={30}
                              defaultValue={address.address1}
                            />
                            <Input
                              placeholder="Address line 2"
                              name="address2"
                              type="text"
                              required
                              minLength={10}
                              defaultValue={address.address2}
                            />
                            <Select
                              required
                              name="state"
                              defaultValue={address.state}
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
                            <Input
                              placeholder="Zipcode"
                              name="zipcode"
                              type="text"
                              required
                              maxLength={6}
                              minLength={6}
                              defaultValue={address.zipcode}
                            />
                            <Input
                              placeholder="Landmark"
                              name="landmark"
                              type="text"
                              required
                              defaultValue={address.landmark}
                            />
                            <FormSubmitButton text="Update" />
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  ))}
                </RadioGroup>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="mt-4 gap-2">
                      <Plus className="w-4 h-4" />
                      Add New Address
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add new Address</DialogTitle>
                    </DialogHeader>
                    <form
                      ref={formRef}
                      action={async (formData) => {
                        handleAddressSubmit(formData);
                      }}
                      className="flex flex-col gap-4 min-w-[40vw] mt-3"
                    >
                      <input
                        type="text"
                        name="id"
                        value={session?.user.id}
                        hidden
                      />
                      <Input placeholder="Name" name="name" type="text" />
                      <Input placeholder="Email" name="email" type="text" />
                      <Input
                        placeholder="Phone"
                        name="phone"
                        type="tel"
                        maxLength={10}
                        minLength={10}
                      />
                      <Input
                        placeholder="Address line 1"
                        name="address1"
                        type="text"
                        minLength={30}
                      />
                      <Input
                        placeholder="Address line 2"
                        name="address2"
                        type="text"
                        minLength={10}
                      />
                      <Select name="state">
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
                        maxLength={6}
                        minLength={6}
                      />
                      <Input
                        placeholder="Landmark"
                        name="landmark"
                        type="text"
                      />
                      <DialogClose asChild>
                        <FormSubmitButton text="Add" />
                      </DialogClose>
                    </form>
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
