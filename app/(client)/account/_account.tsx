"use client";

import { useState } from "react";
import Link from "next/link";
import { capitalizeFirstLetter } from "@/lib/caplitaliseFirstLetter";
import { MapPin, Package, Phone } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { LoaderCircle } from "lucide-react";
import SignOutBtn from "@/components/SignIn/SignOutBtn";
import timeAgo from "@/lib/timeAgo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { phoneNumber } from "@/lib/authClient";
import { Session } from "@/auth";
import { Button } from "@/components/ui/button";

interface AccountProps {
  session: Session;
  orderCount: number;
  addressCount: number;
  getActivity: any[];
}

interface PhoneUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: Session;
  onSubmit: (phone: string) => void;
  loading: boolean;
}

function PhoneUpdateDialog({
  open,
  onOpenChange,
  session,
  onSubmit,
  loading,
}: PhoneUpdateDialogProps) {
  const [phone, setPhone] = useState("");

  const handleSubmit = () => {
    const phoneRegex = /^[6-9]\d{9}$/;
    if (phoneRegex.test(phone)) {
      onSubmit(phone);
    } else {
      toast.error("Please enter a valid 10-digit phone number");
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!loading) {
      onOpenChange(newOpen);
      if (!newOpen) {
        setPhone(""); // Reset phone when dialog closes
      }
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Update Phone Number</AlertDialogTitle>
          <AlertDialogDescription>
            Enter your new phone number to receive an OTP for verification
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4">
          <Label htmlFor="phone" className="text-sm font-medium">
            Phone Number
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="Enter 10-digit phone number"
            defaultValue={session?.user.phoneNumber ?? ""}
            onChange={(e) =>
              setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
            }
            maxLength={10}
            disabled={loading}
            className="mt-2"
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleSubmit}
            disabled={loading || phone.length !== 10}
          >
            {loading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
            Send OTP
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface OTPVerificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  phoneNumber: string;
  onSubmit: (otp: string) => void;
  loading: boolean;
}

function OTPVerificationDialog({
  open,
  onOpenChange,
  phoneNumber,
  onSubmit,
  loading,
}: OTPVerificationDialogProps) {
  const [otp, setOtp] = useState("");

  const handleSubmit = () => {
    if (otp.length === 6) {
      onSubmit(otp);
    } else {
      toast.error("Please enter a valid 6-digit OTP");
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!loading) {
      onOpenChange(newOpen);
      if (!newOpen) {
        setOtp(""); // Reset OTP when dialog closes
      }
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Verify Phone Number</AlertDialogTitle>
          <AlertDialogDescription>
            Enter the 6-digit OTP sent to {phoneNumber}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4 flex justify-center">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(value) => setOtp(value)}
            disabled={loading}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} className="w-12 h-12 text-lg" />
              <InputOTPSlot index={1} className="w-12 h-12 text-lg" />
              <InputOTPSlot index={2} className="w-12 h-12 text-lg" />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} className="w-12 h-12 text-lg" />
              <InputOTPSlot index={4} className="w-12 h-12 text-lg" />
              <InputOTPSlot index={5} className="w-12 h-12 text-lg" />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleSubmit}
            disabled={loading || otp.length !== 6}
          >
            {loading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
            Verify & Update
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

const Account = ({
  session,
  orderCount,
  addressCount,
  getActivity,
}: AccountProps) => {
  const [phoneUpdateDialog, setPhoneUpdateDialog] = useState(false);
  const [otpVerificationDialog, setOtpVerificationDialog] = useState(false);
  const [phoneUpdateLoading, setPhoneUpdateLoading] = useState(false);
  const [otpVerificationLoading, setOtpVerificationLoading] = useState(false);
  const [currentPhone, setCurrentPhone] = useState("");

  const handlePhoneUpdate = async (phone: string) => {
    setPhoneUpdateLoading(true);
    setCurrentPhone(phone);

    try {
      await phoneNumber.sendOtp({
        phoneNumber: phone,
        fetchOptions: {
          onSuccess: () => {
            setPhoneUpdateDialog(false);
            setOtpVerificationDialog(true);
            setPhoneUpdateLoading(false);
            toast.success("OTP sent successfully!");
          },
          onError: (context) => {
            toast.error("Error", {
              description: context.error.message,
              duration: 5000,
            });
            setPhoneUpdateLoading(false);
          },
        },
      });
    } catch (error) {
      toast.error("Error sending OTP");
      setPhoneUpdateLoading(false);
    }
  };

  const handleOtpVerification = async (otp: string) => {
    setOtpVerificationLoading(true);

    try {
      await phoneNumber.verify({
        phoneNumber: currentPhone,
        code: otp,
        updatePhoneNumber: true,
        fetchOptions: {
          onSuccess: () => {
            toast.success("Phone number updated successfully!");
            setOtpVerificationDialog(false);
            setOtpVerificationLoading(false);
            // You might want to refresh the page or update the UI here
          },
          onError: (context) => {
            toast.error("Error", {
              description: context.error.message,
              duration: 5000,
            });
            setOtpVerificationLoading(false);
          },
        },
      });
    } catch (error) {
      toast.error("Error verifying OTP");
      setOtpVerificationLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8 mt-[30px]">
      <div className="flex flex-col items-center space-y-4 md:flex-row md:space-y-0 md:space-x-6 md:justify-start">
        <Avatar className="h-12 w-12 rounded-full">
          <AvatarImage src={session.user.image!} alt={session.user.name} />
          <AvatarFallback className="rounded-full text-xl">
            {session.user.name.slice(0, 1).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="text-center md:text-left">
          <h1 className="text-2xl font-bold">
            {capitalizeFirstLetter(session.user.name)}
          </h1>
          {session.user.role === "admin" && (
            <p className="text-foreground">Admin</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href={"/account/orders"}>
          <Card className="bg-background hover:bg-accent/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Orders
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orderCount}</div>
            </CardContent>
          </Card>
        </Link>

        <Link href={"/account/addresses"}>
          <Card className="bg-background hover:bg-accent/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Your Addresses
              </CardTitle>
              <MapPin className="h-4 w-4 text-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{addressCount}</div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="md:col-span-2 bg-background">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {getActivity.map((item, i) => (
              <div key={i} className="flex items-center space-x-4">
                {item.type === "address" ? (
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Package className="h-4 w-4 text-muted-foreground" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium leading-none">
                    {item.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {timeAgo(item.createdAt)}
                  </p>
                </div>
              </div>
            ))}
            {getActivity.length == 0 && (
              <div>
                <h1 className="text-base text-muted-foreground">
                  No recent Activity
                </h1>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-background">
          <CardHeader>
            <CardTitle>Quick Settings</CardTitle>
            <CardDescription>Manage your preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications">Email Notifications</Label>
              <Switch id="notifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="marketing">Marketing emails</Label>
              <Switch defaultChecked id="marketing" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="updates">Product updates</Label>
              <Switch id="updates" defaultChecked />
            </div>
            <Button
              className="w-full"
              onClick={() => setPhoneUpdateDialog(true)}
            >
              <Phone className="mr-2 h-4 w-4" /> Update Phone Number
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center pt-6">
        <SignOutBtn />
      </div>

      {/* Phone Update Dialog */}
      <PhoneUpdateDialog
        session={session}
        open={phoneUpdateDialog}
        onOpenChange={setPhoneUpdateDialog}
        onSubmit={handlePhoneUpdate}
        loading={phoneUpdateLoading}
      />

      {/* OTP Verification Dialog */}
      <OTPVerificationDialog
        open={otpVerificationDialog}
        onOpenChange={setOtpVerificationDialog}
        phoneNumber={currentPhone}
        onSubmit={handleOtpVerification}
        loading={otpVerificationLoading}
      />
    </div>
  );
};

export default Account;
