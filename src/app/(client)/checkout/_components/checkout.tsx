"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { createGuestAddress, createNewAddress } from "@/functions/user/address";
import { CreateOrder, CreateOrderForLoggedOutUsers } from "@/functions/user/create-order";
import { useCheckout } from "@/hooks/useCheckout";
import { states } from "@/lib/constants";
import { convertImage } from "@/lib/convert-image";
import { Address } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { AddressFormSchema, CreateCheckoutUser } from "@/lib/zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  LoaderCircle,
  Package,
  PlusIcon,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { type RazorpayOrderOptions, useRazorpay } from "react-razorpay";
import { toast } from "sonner";
import type { z } from "zod";

export default function ModernCheckout({
  addresses,
  isLoggedIn,
}: {
  addresses: Address[] | null;
  isLoggedIn: boolean;
}) {
  const { checkoutItems } = useCheckout();
  if (!checkoutItems || checkoutItems.length == 0) {
    redirect("/");
  }

  console.log(checkoutItems);

  const price =
    checkoutItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0) || 0;

  const { Razorpay } = useRazorpay();
  const [selectedAddress, setSelectedAddress] = useState<Address>();
  const [loading, setLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const hasNoAddresses = isLoggedIn && (!addresses || addresses.length === 0);

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

  const guestForm = useForm<z.infer<typeof CreateCheckoutUser>>({
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

  async function handlePayButton() {
    setLoading(true);
    if (!selectedAddress) {
      toast.error("Select an Address", {
        duration: 3000,
      });
      setLoading(false);
      return null;
    }
    if (!checkoutItems || checkoutItems.length == 0) {
      redirect("/");
    }
    const products = checkoutItems.map((item) => {
      return {
        productWithQuantity: item.product,
        quantity: item.quantity,
        size: item.size,
      };
    });
    const res = await CreateOrder(products, selectedAddress.id);
    if (!res.success || !res.data) {
      toast.error(res.message, {
        duration: 6000,
      });
      setLoading(false);
      return;
    }
    const { orderID, price } = res.data;
    const options: RazorpayOrderOptions = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
      amount: price * 100,
      currency: "INR",
      name: `Payment for your Order ${orderID}`,
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
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?orderId=${orderID}`,
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
    razorpayInstance.open();
  }

  async function handleCreateAddress(values: z.infer<typeof AddressFormSchema>) {
    setCreateLoading(true);
    const getTTD = await fetch("/api/pincode?pincode=" + values.zipcode);
    const data = await getTTD.json();

    if (!data.success) {
      toast.error("This pincode is not Serviceable");
      setCreateLoading(false);
      return;
    }
    const { message, success } = await createNewAddress(values);
    if (!success) {
      setCreateLoading(false);
      setCreateModalOpen(false);
      toast.error(message);
      return;
    }
    setCreateLoading(false);
    setCreateModalOpen(false);
  }

  async function onGuestSubmit(values: z.infer<typeof CreateCheckoutUser>) {
    setLoading(true);
    const { message, success, data } = await createGuestAddress(values);
    if (!success || !data) {
      toast.error(message, {
        duration: 3000,
      });
      setLoading(false);
      return null;
    }
    if (!checkoutItems || checkoutItems.length == 0) {
      redirect("/");
    }
    const products = checkoutItems.map((item) => {
      return {
        productWithQuantity: item.product,
        quantity: item.quantity,
        size: item.size,
      };
    });
    const res = await CreateOrderForLoggedOutUsers(products, data.id, data.userId);
    if (!res.success || !res.data) {
      toast.error(res.message, {
        duration: 6000,
      });
      setLoading(false);
      return;
    }
    const { orderID, price } = res.data;
    const options: RazorpayOrderOptions = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
      amount: price * 100,
      currency: "INR",
      name: "AIRA",
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
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?orderId=${orderID}`,
      prefill: {
        name: data.firstName,
        email: data.email,
        contact: data.phone,
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
    razorpayInstance.open();
  }

  return (
    <div className="flex w-full flex-col gap-8 lg:flex-row">
      <div className="flex-1">
        <Card className="shadow-sm">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Package className="h-5 w-5" />
              Checkout
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoggedIn ? (
              <>
                {hasNoAddresses ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-medium">Create Address</h2>
                      <div className="text-muted-foreground text-sm">
                        All fields are required
                      </div>
                    </div>
                    <Form {...createForm}>
                      <form
                        id="createAddressForm"
                        className="space-y-4"
                        onSubmit={createForm.handleSubmit(handleCreateAddress)}
                      >
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                                  <Input placeholder="Last Name" type="text" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                        </div>
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
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                            name="landmark"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Landmark</FormLabel>
                                <FormControl>
                                  <Input placeholder="Landmark" type="text" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                                    <SelectTrigger className="w-full">
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
                                  <Input {...field} placeholder="Zipcode" type="text" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <Button
                          type="submit"
                          className="mt-4 w-full"
                          disabled={createLoading}
                        >
                          {createLoading && (
                            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          Save Address
                        </Button>
                      </form>
                    </Form>
                  </div>
                ) : (
                  // Show address selection if user has addresses
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-medium">Select an Address</h2>
                      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <PlusIcon className="mr-1 h-4 w-4" /> Add New Address
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="flex flex-col gap-0 p-0 sm:max-h-[min(640px,80vh)] sm:max-w-lg">
                          <DialogHeader className="border-b p-4">
                            <DialogTitle>Create Address</DialogTitle>
                          </DialogHeader>
                          <div className="overflow-y-auto px-4 pb-5">
                            <Form {...createForm}>
                              <form
                                id="createAddressForm"
                                className="mt-3 flex flex-col gap-4"
                                onSubmit={createForm.handleSubmit(handleCreateAddress)}
                              >
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                                </div>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                                </div>
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
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                                    name="landmark"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Landmark</FormLabel>
                                        <FormControl>
                                          <Input
                                            placeholder="Landmark"
                                            type="text"
                                            {...field}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                                            <SelectTrigger className="w-full">
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
                                </div>
                              </form>
                            </Form>
                          </div>
                          <DialogFooter className="border-t p-4">
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
                              {createLoading && (
                                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                              )}
                              Add
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <div className="space-y-4">
                      {addresses?.map((address) => (
                        <div
                          key={address.id}
                          className={`relative flex w-full items-start gap-3 rounded-md border p-4 shadow-sm transition-all ${
                            selectedAddress?.id === address.id
                              ? "border-primary bg-primary/5"
                              : "border-input hover:border-primary/50"
                          }`}
                          onClick={() => setSelectedAddress(address)}
                        >
                          <Checkbox
                            id={address.id}
                            checked={selectedAddress?.id === address.id}
                            onCheckedChange={() => setSelectedAddress(address)}
                            className="mt-1"
                          />
                          <div className="grid grow gap-1">
                            <Label htmlFor={address.id} className="font-medium">
                              {address.firstName} {address.lastName}
                            </Label>
                            <p className="text-muted-foreground text-sm">
                              {address.address1},{" "}
                              {address.address2 && `${address.address2}, `}
                              {address.landmark && `${address.landmark}, `}
                              {address.city}, {address.state}, {address.zipcode}
                            </p>
                            <p className="text-muted-foreground mt-1 text-sm">
                              {address.phone}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              // Guest checkout view
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium">Contact Information</h2>
                  <div className="text-sm">
                    Already have an account?{" "}
                    <Link href="/signin" className="text-primary hover:underline">
                      Log in
                    </Link>
                  </div>
                </div>
                <Form {...guestForm}>
                  <form
                    id="checkoutForm"
                    onSubmit={guestForm.handleSubmit(onGuestSubmit)}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      <div className="flex w-full items-center justify-between gap-4 max-md:flex-wrap">
                        <FormField
                          control={guestForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="Email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={guestForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel>Phone</FormLabel>
                              <FormControl>
                                <Input placeholder="Phone" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={guestForm.control}
                        name="emailOffers"
                        render={({ field }) => (
                          <FormItem className="flex items-start space-y-0 space-x-3 pt-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                Notify me about new arrivals and offers
                              </FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-4">
                      <h2 className="border-t pt-4 text-lg font-medium">
                        Shipping Address
                      </h2>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <FormField
                          control={guestForm.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input placeholder="First Name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={guestForm.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
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
                        control={guestForm.control}
                        name="address1"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address Line 1</FormLabel>
                            <FormControl>
                              <Input placeholder="Address Line 1" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={guestForm.control}
                        name="address2"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address Line 2</FormLabel>
                            <FormControl>
                              <Input placeholder="Address Line 2" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <FormField
                          control={guestForm.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input placeholder="City" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={guestForm.control}
                          name="landmark"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Landmark</FormLabel>
                              <FormControl>
                                <Input placeholder="Landmark" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <FormField
                          control={guestForm.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="w-full">
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
                          control={guestForm.control}
                          name="zipcode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Zipcode</FormLabel>
                              <FormControl>
                                <Input placeholder="Zipcode" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <Button type="submit" className="mt-4 w-full" disabled={loading}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Complete Checkout
                    </Button>
                  </form>
                </Form>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="w-full flex-1">
        <Card className="sticky top-4 shadow-sm">
          <CardHeader className="border-b pb-3">
            <CardTitle className="flex items-center gap-2 text-xl">
              <ShoppingBag className="h-5 w-5" />
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {checkoutItems?.map((item) => (
                <div key={item.product.id} className="flex items-start gap-3">
                  <div className="relative">
                    <Image
                      src={convertImage(item.product.images[0])}
                      alt={item.product.title}
                      width={60}
                      height={60}
                      priority
                      className="aspect-square rounded-md border object-cover object-top"
                    />
                    <div className="bg-primary text-primary-foreground absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full text-xs font-medium">
                      {item.quantity}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="line-clamp-1 font-medium">{item.product.title}</h3>
                    {item.size && (
                      <p className="text-muted-foreground text-xs">
                        Size:{" "}
                        {item.size === "sm"
                          ? "Small"
                          : item.size === "md"
                            ? "Medium"
                            : item.size === "lg"
                              ? "Large"
                              : item.size === "xl"
                                ? "Extra Large"
                                : item.size === "doublexl"
                                  ? "Double XL"
                                  : "Unknown"}
                      </p>
                    )}
                    <p className="mt-1 font-medium">
                      Rs. {formatCurrency(item.product.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Separator className="my-6" />
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>Rs. {formatCurrency(price)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              <Separator className="my-3" />
              <div className="flex justify-between text-lg font-medium">
                <span>Total</span>
                <span>Rs. {formatCurrency(price)}</span>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {!isLoggedIn && (
                <Button form="checkoutForm" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Complete Checkout
                </Button>
              )}

              {isLoggedIn && !hasNoAddresses && (
                <Button
                  onClick={handlePayButton}
                  className="w-full"
                  disabled={loading || !selectedAddress}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Proceed to Payment
                </Button>
              )}

              <div className="text-muted-foreground flex items-center justify-center gap-1.5 text-sm">
                <ShieldCheck className="h-4 w-4" />
                <span>Secure checkout with Razorpay</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
