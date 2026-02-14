"use client";

import { Session } from "@/auth/server";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogTitle } from "@/components/ui/dialog";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { createNewAddress } from "@/functions/user/address";
import {
  CreateCodOrder,
  CreateCodOrderForLoggedInUsers,
  CreateOrder,
  CreateOrderForLoggedOutUsers,
} from "@/functions/user/create-order";
import { useCart } from "@/hooks/useCart";
import { useCheckout } from "@/hooks/useCheckout";
import { ApiResponse } from "@/lib/api-responses";
import { states } from "@/lib/constants";
import { convertImage } from "@/lib/convert-image";
import { Address, Coupon } from "@/lib/types";
import { event } from "@/lib/fbpixel";
import { formatCurrency } from "@/lib/utils";
import {
  AddressFormSchema,
  couponCodeSchema,
  CreateCheckoutUser,
} from "@/lib/zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { sendGTMEvent } from "@next/third-parties/google";
import {
  CheckCircle2,
  CreditCard,
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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { type RazorpayOrderOptions, useRazorpay } from "react-razorpay";
import { toast } from "sonner";
import type { z } from "zod";

export type CouponData = {
  code: string;
  type: string;
  value: number;
};

export default function ModernCheckout({
  addresses,
  isLoggedIn,
  session,
}: {
  addresses: Address[] | null;
  isLoggedIn: boolean;
  session: Session | null;
}) {
  const { checkoutItems } = useCheckout();
  if (!checkoutItems || checkoutItems.length == 0) {
    redirect("/");
  }

  const wallet = session?.user.storeCredit || null;

  const price =
    checkoutItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0) || 0;

  const remainingCredit = price - wallet!;
  const creditBeingUsed = () => {
    if (wallet! > price) {
      return price;
    }
    return wallet!;
  };

  const { Razorpay } = useRazorpay();
  const [selectedAddress, setSelectedAddress] = useState<Address>();
  const [loading, setLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [coupon, setCoupon] = useState<CouponData | undefined>();
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "razorpay">("razorpay");
  const [codDialogOpen, setCodDialogOpen] = useState(false);
  const { cart, removeFromCart } = useCart();

  const [useStoreCredit, setUseStoreCredit] = useState(false);

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
      zipcode: "",
    },
  });

  const couponForm = useForm<z.infer<typeof couponCodeSchema>>({
    resolver: zodResolver(couponCodeSchema),
    values: {
      code: "",
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
      zipcode: "",
      emailOffers: true,
    },
  });

  const guestZipcode = guestForm.watch("zipcode");

  const effectiveZipcode = isLoggedIn
    ? selectedAddress?.zipcode
    : guestZipcode?.length === 6
      ? guestZipcode
      : undefined;

  const totalWeight = checkoutItems.reduce((acc, item) => acc + 250 * item.quantity, 0);

  const { data: shippingCostData } = useQuery({
    queryKey: ["shipping-cost", effectiveZipcode, totalWeight, paymentMethod],
    enabled: !!effectiveZipcode && effectiveZipcode.length === 6,

    queryFn: async () => {
      const res = await fetch(
        `/api/shipping-cost?pincode=${effectiveZipcode}&totalWeight=${totalWeight}`,
      );
      const data = await res.json();
      return data;
    },
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  useEffect(() => {
    if (useStoreCredit) {
      setCoupon(undefined);
      couponForm.reset();
    }
  }, [useStoreCredit, couponForm]);

  function clearCart() {
    for (const item of cart) {
      removeFromCart(item.product.id);
    }
  }

  async function handleCodOrderForLoggedInUsers() {
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
    const res = await CreateCodOrderForLoggedInUsers(
      products,
      selectedAddress.id,
      useStoreCredit,
      coupon,
    );
    if (!res.success || !res.data) {
      toast.error(res.message);
      if (res.message.includes("Out of stock")) {
        clearCart();
      }
      setLoading(false);
      setCodDialogOpen(false);
      setCoupon(undefined);
      return;
    }
    setCodDialogOpen(false);
    setLoading(false);
    clearCart();
    redirect(`/success?orderId=${res.data.orderID}`);
  }

  async function handlePayButton() {
    setLoading(true);
    sendGTMEvent({
      event: "checkout_button_clicked",
      value: checkoutItems?.map((item) => item.product.title),
    });
    event("CheckoutButtonClicked", {
      content_ids: checkoutItems?.map((item) => item.product.id),
      content_type: "product",
      value: checkoutItems?.reduce(
        (acc, item) => acc + item.product.price * item.quantity,
        0,
      ),
      currency: "INR",
      product_name: checkoutItems?.map((item) => item.product.title),
      size: checkoutItems?.map((item) => item.size),
    });
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
    const res = await CreateOrder(products, selectedAddress.id, useStoreCredit, coupon);
    if (!res.success || !res.data) {
      setCoupon(undefined);
      toast.error(res.message, {
        duration: 6000,
      });
      if (res.message.includes("Out of stock")) {
        clearCart();
      }
      setLoading(false);
      return;
    }
    const { orderID, NoRazorpayOrder, price } = res.data;
    if (NoRazorpayOrder) {
      return redirect(`/success?orderId=${orderID}`);
    }
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
      handler: (response) => {
        redirect(`/success?orderId=${response.razorpay_order_id}`);
      },
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

  function calculateDiscount(price: number): number {
    if (!coupon) return price;

    if (coupon.type === "percentage") {
      return price - (price * coupon.value) / 100;
    }

    return price - coupon.value;
  }

  async function submitCoupon(values: z.infer<typeof couponCodeSchema>) {
    const response = await fetch(`/api/coupon?code=${values.code}`);
    const res: ApiResponse<Coupon> = await response.json();
    if (!res.success || !res.data) {
      toast.error(res.message);
      setCoupon(undefined);
      return;
    }
    toast.success(res.message);
    couponForm.reset();
    setCoupon({
      code: res.data.code,
      type: res.data.type,
      value: Number(res.data.value),
    });
  }

  async function handleCodOrder(values: z.infer<typeof CreateCheckoutUser>) {
    setLoading(true);
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
    const res = await CreateCodOrder(products, values, coupon);
    if (!res.success || !res.data) {
      toast.error(res.message);
      if (res.message.includes("Out of stock")) {
        clearCart();
      }
      setLoading(false);
      setCodDialogOpen(false);
      setCoupon(undefined);
      return;
    }
    setCodDialogOpen(false);
    setLoading(false);
    clearCart();
    redirect(`/success?orderId=${res.data.orderID}`);
  }

  async function onGuestSubmit(values: z.infer<typeof CreateCheckoutUser>) {
    if (paymentMethod === "cod") {
      setCodDialogOpen(true);
      return;
    }
    setLoading(true);
    sendGTMEvent({
      event: "checkout_button_clicked",
      value: checkoutItems?.map((item) => item.product.title),
    });
    event("CheckoutButtonClicked", {
      content_ids: checkoutItems?.map((item) => item.product.id),
      content_type: "product",
      value: checkoutItems?.reduce(
        (acc, item) => acc + item.product.price * item.quantity,
        0,
      ),
      currency: "INR",
      product_name: checkoutItems?.map((item) => item.product.title),
      size: checkoutItems?.map((item) => item.size),
    });
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
    const { data, success, message } = await CreateOrderForLoggedOutUsers(
      products,
      values,
      coupon,
    );
    if (!success || !data) {
      toast.error(message, {
        duration: 6000,
      });
      setCoupon(undefined);
      setLoading(false);
      return;
    }
    const { orderID, price } = data;
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
      handler: (response) => {
        redirect(`/success?orderId=${response.razorpay_order_id}`);
      },
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
    <>
      <div className="flex w-full flex-col gap-8 lg:flex-row">
        <div className="flex-1">
          <Card className="shadow-sm">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
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
                                  <FormLabel>
                                    First Name
                                    <span className="text-destructive align-super">
                                      *
                                    </span>
                                  </FormLabel>
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
                                  <FormLabel>
                                    Email
                                    <span className="text-destructive align-super">
                                      *
                                    </span>
                                  </FormLabel>
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
                                  <FormLabel>
                                    Phone
                                    <span className="text-destructive align-super">
                                      *
                                    </span>
                                  </FormLabel>
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
                                <FormLabel>
                                  Address line 1
                                  <span className="text-destructive align-super">*</span>
                                </FormLabel>
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
                                  <FormLabel>
                                    City
                                    <span className="text-destructive align-super">
                                      *
                                    </span>
                                  </FormLabel>
                                  <FormControl>
                                    <Input placeholder="City" type="text" {...field} />
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
                                  <FormLabel>
                                    State
                                    <span className="text-destructive align-super">
                                      *
                                    </span>
                                  </FormLabel>
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
                                  <FormLabel>
                                    Zipcode
                                    <span className="text-destructive align-super">
                                      *
                                    </span>
                                  </FormLabel>
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
                        <Sheet open={createModalOpen} onOpenChange={setCreateModalOpen}>
                          <SheetTrigger
                            render={
                              <Button variant="outline" size="sm">
                                <PlusIcon className="mr-1 h-4 w-4" /> Add New Address
                              </Button>
                            }
                          />
                          <SheetContent>
                            <SheetHeader className="border-b p-4">
                              <DialogTitle>Create Address</DialogTitle>
                            </SheetHeader>
                            <div className="overflow-y-auto px-4 pb-5">
                              <Form {...createForm}>
                                <form
                                  id="createAddressForm"
                                  className="mt-3 flex flex-col gap-4"
                                  onSubmit={createForm.handleSubmit(handleCreateAddress)}
                                >
                                  <FormField
                                    control={createForm.control}
                                    name="firstName"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>
                                          First Name
                                          <span className="text-destructive align-super">
                                            *
                                          </span>
                                        </FormLabel>
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
                                        <FormLabel>
                                          Last Name
                                          <span className="text-destructive align-super">
                                            *
                                          </span>
                                        </FormLabel>
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
                                        <FormLabel>
                                          Email
                                          <span className="text-destructive align-super">
                                            *
                                          </span>
                                        </FormLabel>
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
                                        <FormLabel>
                                          Phone
                                          <span className="text-destructive align-super">
                                            *
                                          </span>
                                        </FormLabel>
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
                                        <FormLabel>
                                          Address line 1
                                          <span className="text-destructive align-super">
                                            *
                                          </span>
                                        </FormLabel>
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
                                        <FormLabel>
                                          City
                                          <span className="text-destructive align-super">
                                            *
                                          </span>
                                        </FormLabel>
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
                                        <FormLabel>
                                          State
                                          <span className="text-destructive align-super">
                                            *
                                          </span>
                                        </FormLabel>
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
                                        <FormLabel>
                                          Zipcode
                                          <span className="text-destructive align-super">
                                            *
                                          </span>
                                        </FormLabel>
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
                                </form>
                              </Form>
                            </div>
                            <SheetFooter className="flex flex-col border-t p-4">
                              <SheetClose
                                render={
                                  <Button variant="outline" className="">
                                    Cancel
                                  </Button>
                                }
                              />
                              <Button
                                form="createAddressForm"
                                className=""
                                type="submit"
                                disabled={createLoading}
                              >
                                {createLoading && (
                                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Add
                              </Button>
                            </SheetFooter>
                          </SheetContent>
                        </Sheet>
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
                  <div className="flex items-center justify-between gap-x-2">
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
                                <FormLabel>
                                  Email
                                  <span className="text-destructive align-super">*</span>
                                </FormLabel>
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
                                <FormLabel>
                                  Phone
                                  <span className="text-destructive align-super">*</span>
                                </FormLabel>
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
                                <FormLabel>
                                  First Name
                                  <span className="text-destructive align-super">*</span>
                                </FormLabel>
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
                              <FormLabel>
                                Address Line 1
                                <span className="text-destructive align-super">*</span>
                              </FormLabel>
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
                                <FormLabel>
                                  City
                                  <span className="text-destructive align-super">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input placeholder="City" {...field} />
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
                                <FormLabel>
                                  State
                                  <span className="text-destructive align-super">*</span>
                                </FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
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
                                <FormLabel>
                                  Zipcode
                                  <span className="text-destructive align-super">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input placeholder="Zipcode" {...field} />
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
              )}
            </CardContent>
          </Card>
        </div>
        <div className="w-full flex-1">
          <div className="flex flex-col gap-5">
            <Card>
              <CardHeader className="border-b pb-3">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(value) => setPaymentMethod(value)}
                >
                  <div className="flex cursor-pointer items-center space-x-2 rounded-lg border p-4">
                    <RadioGroupItem value="cod" id="cod" />
                    <label htmlFor="cod" className="flex-1 cursor-pointer">
                      <div>
                        <p className="text-secondary-foreground text-sm font-semibold">
                          Cash on Delivery
                        </p>
                        <p className="text-secondary-foreground text-xs">
                          Pay when you receive the order
                        </p>
                      </div>
                    </label>
                  </div>
                  <div className="flex cursor-pointer items-center space-x-2 rounded-lg border p-4">
                    <RadioGroupItem value="razorpay" id="razorpay" />
                    <label htmlFor="razorpay" className="flex-1 cursor-pointer">
                      <div>
                        <p className="text-secondary-foreground text-sm font-semibold">
                          Razorpay Checkout
                        </p>
                        <p className="text-secondary-foreground text-xs">Free Shipping</p>
                      </div>
                    </label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
            <Card className="sticky top-4 shadow-sm">
              <CardHeader className="border-b pb-3">
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {checkoutItems?.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="relative">
                        <Image
                          src={convertImage(item.product.images[0], 200)}
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
                  {wallet && wallet > 0 && (
                    <Card className="relative overflow-hidden p-0">
                      <CardContent className="relative p-6">
                        <div className="flex items-start gap-4">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                                  Store Credit Available
                                </h3>
                                <p className="text-muted-foreground text-sm">
                                  Use your available balance
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="text-xl font-semibold">
                                  ₹{formatCurrency(wallet)}
                                </div>
                              </div>
                            </div>
                            {/* Checkbox section */}
                            <div className="flex items-center space-x-3 rounded-lg bg-white/60 p-3">
                              <Checkbox
                                id="use-store-credit"
                                checked={useStoreCredit}
                                onCheckedChange={(checked) =>
                                  setUseStoreCredit(checked as boolean)
                                }
                                className="data-[state=checked]:bg-accent data-[state=checked]:border-emerald-600"
                              />
                              <label
                                htmlFor="use-store-credit"
                                className="flex-1 cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Apply store credit to this order
                              </label>
                              {useStoreCredit && (
                                <CheckCircle2 className="text-accent h-4 w-4" />
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="whitespace-nowrap">Rs. {formatCurrency(price)}</span>
                  </div>
                  {useStoreCredit && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Store Credit</span>
                      <span className="text-destructive">
                        - {formatCurrency(creditBeingUsed())}
                      </span>
                    </div>
                  )}
                  <div className="flex flex-col justify-between">
                    <div className="flex justify-between gap-x-2">
                      <span className="text-muted-foreground">
                        Shipping{" "}
                        <span className="text-muted-foreground text-sm">
                          (Free for Prepaid Orders)
                        </span>
                      </span>
                      <span className="font-medium whitespace-nowrap text-green-600">
                        Rs.{" "}
                        {paymentMethod == "cod"
                          ? formatCurrency(shippingCostData?.shippingCost ?? 0)
                          : formatCurrency(0)}
                      </span>
                    </div>
                  </div>
                  {coupon && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{coupon.code}</span>
                      <span className="font-medium whitespace-nowrap text-green-600">
                        - {coupon.value}
                        {coupon.type == "percentage" ? "%" : " Rs"}
                      </span>
                    </div>
                  )}
                  {!useStoreCredit && (
                    <div className="my-3">
                      <Form {...couponForm}>
                        <form
                          id="couponForm"
                          onSubmit={couponForm.handleSubmit(submitCoupon)}
                          className="flex gap-2"
                        >
                          <FormField
                            control={couponForm.control}
                            name="code"
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormControl>
                                  <Input placeholder="Coupon Code" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button form="couponForm" type="submit">
                            Apply
                          </Button>
                        </form>
                      </Form>
                    </div>
                  )}
                  {/* <Separator className="my-3" /> */}
                  <div className="flex justify-between text-lg font-medium">
                    <span>Total</span>
                    {useStoreCredit ? (
                      <span className="whitespace-nowrap">
                        Rs.{" "}
                        {formatCurrency(
                          remainingCredit <= 0 ? 0 : calculateDiscount(remainingCredit),
                        )}
                      </span>
                    ) : (
                      <span className="whitespace-nowrap">
                        Rs.{" "}
                        {paymentMethod == "cod"
                          ? formatCurrency(
                              calculateDiscount(price) +
                                (shippingCostData?.shippingCost || 0),
                            )
                          : formatCurrency(calculateDiscount(price))}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  {!isLoggedIn && paymentMethod === "razorpay" && (
                    <Button
                      form="checkoutForm"
                      type="submit"
                      className="w-full"
                      disabled={loading}
                    >
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Complete Checkout
                    </Button>
                  )}

                  {isLoggedIn && !hasNoAddresses && paymentMethod === "razorpay" && (
                    <Button
                      onClick={handlePayButton}
                      className="w-full"
                      type="submit"
                      disabled={loading || !selectedAddress}
                    >
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Complete Checkout
                    </Button>
                  )}
                  {!isLoggedIn && paymentMethod === "cod" && (
                    <Button
                      form="checkoutForm"
                      type="submit"
                      className="w-full"
                      disabled={loading}
                    >
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Place Order
                    </Button>
                  )}

                  {isLoggedIn && !hasNoAddresses && paymentMethod === "cod" && (
                    <Button
                      onClick={handleCodOrderForLoggedInUsers}
                      className="w-full"
                      type="submit"
                      disabled={loading || !selectedAddress}
                    >
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Place Order
                    </Button>
                  )}

                  {paymentMethod === "razorpay" && (
                    <div className="text-muted-foreground flex items-center justify-center gap-1.5 text-sm">
                      <ShieldCheck className="h-4 w-4" />
                      <span>Secure checkout with Razorpay</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <AlertDialog open={codDialogOpen} onOpenChange={setCodDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm COD Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to place this order with Cash on Delivery?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleCodOrder(guestForm.getValues())}>
              {loading && <Spinner />}Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
