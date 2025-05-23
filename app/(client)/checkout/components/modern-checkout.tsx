"use client";

import { useState } from "react";
import { useCheckoutStore } from "@/context/checkoutStore";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  LoaderCircle,
  PlusIcon,
  ShieldCheck,
  Package,
  ShoppingBag,
} from "lucide-react";
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
import type { UserWithAddress } from "@/lib/types";
import formatCurrency from "@/lib/formatCurrency";
import Image from "next/image";
import Link from "next/link";
import type { address } from "@prisma/client";
import { CreateRazorpayOrder } from "@/actions/razorpay.createOrder";
import { type RazorpayOrderOptions, useRazorpay } from "react-razorpay";
import { CreateOrder } from "@/actions/CreateOrder";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AddressFormSchema, CreateCheckoutUser } from "@/lib/zodSchemas";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { CreateUser, CreateUserAddress } from "@/actions/CreateNewUser";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

export default function ModernCheckout({
  addresses,
  isLoggedIn,
}: {
  addresses: UserWithAddress | null;
  isLoggedIn: boolean;
}) {
  const { checkoutItems } = useCheckoutStore();
  if (checkoutItems?.length === 0) redirect("/");

  const { Razorpay } = useRazorpay();
  const [selectedAddress, setSelectedAddress] = useState<address>();
  const [loading, setLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const price =
    checkoutItems?.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    ) || 0;

  const hasNoAddresses =
    isLoggedIn && (!addresses?.address || addresses.address.length === 0);

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
      setLoading(false);
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
          : `https://${process.env.NEXT_PUBLIC_BASE_URL}/success?orderId=${orderID}`,
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
      toast.error(res.error, {
        duration: 6000,
      });
      setLoading(false);
      return null;
    }
    razorpayInstance.open();
  }

  async function handleCreateAddress(
    values: z.infer<typeof AddressFormSchema>
  ) {
    setCreateLoading(true);
    await createNewAddress(values);
    setCreateLoading(false);
    setCreateModalOpen(false);
  }

  async function onGuestSubmit(values: z.infer<typeof CreateCheckoutUser>) {
    setLoading(true);
    const user = await CreateUser(values);
    const userAddress = await CreateUserAddress(values, user?.id);
    if (!userAddress) {
      toast.error("Failed to create address", {
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
      setLoading(false);
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
          : `https://${process.env.NEXT_PUBLIC_BASE_URL}/success?orderId=${orderID}`,
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
    <div className="flex flex-col lg:flex-row w-full gap-8">
      <div className="flex-1">
        <Card className="shadow-sm">
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-xl flex items-center gap-2">
              <Package className="h-5 w-5" />
              Checkout
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {isLoggedIn ? (
              <>
                {hasNoAddresses ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-medium">Create Address</h2>
                      <div className="text-sm text-muted-foreground">
                        All fields are required
                      </div>
                    </div>
                    <Form {...createForm}>
                      <form
                        id="createAddressForm"
                        className="space-y-4"
                        onSubmit={createForm.handleSubmit(handleCreateAddress)}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        </div>
                        <Button
                          type="submit"
                          className="w-full mt-4"
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
                      <Dialog
                        open={createModalOpen}
                        onOpenChange={setCreateModalOpen}
                      >
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <PlusIcon className="mr-1 h-4 w-4" /> Add New
                            Address
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="flex flex-col gap-0 p-0 sm:max-h-[min(640px,80vh)] sm:max-w-lg">
                          <DialogHeader className="p-4 border-b">
                            <DialogTitle>Create Address</DialogTitle>
                          </DialogHeader>
                          <div className="overflow-y-auto px-4 pb-5">
                            <Form {...createForm}>
                              <form
                                id="createAddressForm"
                                className="flex flex-col gap-4 mt-3"
                                onSubmit={createForm.handleSubmit(
                                  handleCreateAddress
                                )}
                              >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                                <SelectItem
                                                  value={state}
                                                  key={i}
                                                >
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
                              {createLoading && (
                                <LoaderCircle className="animate-spin mr-2 h-4 w-4" />
                              )}
                              Add
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <div className="space-y-4">
                      {addresses?.address.map((address) => (
                        <div
                          key={address.id}
                          className={`border relative flex w-full items-start gap-3 rounded-md p-4 shadow-sm transition-all ${
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
                            <p className="text-sm text-muted-foreground">
                              {address.address1},{" "}
                              {address.address2 && `${address.address2}, `}
                              {address.landmark && `${address.landmark}, `}
                              {address.city}, {address.state}, {address.zipcode}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
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
                    <Link
                      href="/signin"
                      className="text-primary hover:underline"
                    >
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
                      <FormField
                        control={guestForm.control}
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
                        control={guestForm.control}
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
                      <FormField
                        control={guestForm.control}
                        name="emailOffers"
                        render={({ field }) => (
                          <FormItem className="flex items-start space-x-3 space-y-0 pt-2">
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
                      <h2 className="text-lg font-medium border-t pt-4">
                        Shipping Address
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                  <SelectTrigger>
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
                    <Button
                      type="submit"
                      className="w-full mt-4"
                      disabled={loading}
                    >
                      {loading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
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
        <Card className="shadow-sm sticky top-4">
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-xl flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {checkoutItems?.map((item) => (
                <div key={item.product.id} className="flex items-start gap-3">
                  <div className="relative">
                    <Image
                      src={item.product.images[0] || "/placeholder.svg"}
                      alt={item.product.title}
                      width={60}
                      height={60}
                      priority
                      className="object-cover aspect-square rounded-md border"
                    />
                    <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                      {item.quantity}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium line-clamp-1">
                      {item.product.title}
                    </h3>
                    {item.size && (
                      <p className="text-xs text-muted-foreground">
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
                    <p className="font-medium mt-1">
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
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <Separator className="my-3" />
              <div className="flex justify-between font-medium text-lg">
                <span>Total</span>
                <span>Rs. {formatCurrency(price)}</span>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {!isLoggedIn && (
                <Button
                  form="checkoutForm"
                  className="w-full"
                  disabled={loading}
                >
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

              <div className="flex items-center justify-center text-sm text-muted-foreground gap-1.5">
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
