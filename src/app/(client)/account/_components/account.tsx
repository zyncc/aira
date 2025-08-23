"use client";

import { authClient } from "@/auth/auth-client";
import { type Session } from "@/auth/server";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { handleEmailOffers } from "@/functions/user/email-offers";
import { Activity } from "@/lib/types";
import { LoaderCircle, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface AccountProps {
  session: Session;
  getActivity: Activity[];
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
        setPhone("");
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
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
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
        setOtp("");
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
        <div className="flex justify-center py-4">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(value) => setOtp(value)}
            disabled={loading}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} className="h-12 w-12 text-lg" />
              <InputOTPSlot index={1} className="h-12 w-12 text-lg" />
              <InputOTPSlot index={2} className="h-12 w-12 text-lg" />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} className="h-12 w-12 text-lg" />
              <InputOTPSlot index={4} className="h-12 w-12 text-lg" />
              <InputOTPSlot index={5} className="h-12 w-12 text-lg" />
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

const Account = ({ session }: AccountProps) => {
  const [phoneUpdateDialog, setPhoneUpdateDialog] = useState(false);
  const [otpVerificationDialog, setOtpVerificationDialog] = useState(false);
  const [phoneUpdateLoading, setPhoneUpdateLoading] = useState(false);
  const [otpVerificationLoading, setOtpVerificationLoading] = useState(false);
  const [currentPhone, setCurrentPhone] = useState("");

  const handlePhoneUpdate = async (phone: string) => {
    setPhoneUpdateLoading(true);
    setCurrentPhone(phone);

    try {
      await authClient.phoneNumber.sendOtp({
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
    } catch (_) {
      toast.error("Error sending OTP");
      setPhoneUpdateLoading(false);
    }
  };

  const handleOtpVerification = async (otp: string) => {
    setOtpVerificationLoading(true);

    try {
      await authClient.phoneNumber.verify({
        phoneNumber: currentPhone,
        code: otp,
        updatePhoneNumber: true,
        fetchOptions: {
          onSuccess: () => {
            toast.success("Phone number updated successfully!");
            setOtpVerificationDialog(false);
            setOtpVerificationLoading(false);
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

  async function handleEmailOffersChange(event: boolean) {
    const res = await handleEmailOffers(event);
    if (!res.success) {
      toast.error(res.message);
      return;
    }
    toast.success("Settings updated successfully!");
  }

  return (
    <>
      <Card className="bg-background h-fit">
        <CardHeader>
          <CardTitle>Quick Settings</CardTitle>
          <CardDescription>Manage your preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="marketing">Marketing emails</Label>
            <Switch
              onCheckedChange={handleEmailOffersChange}
              defaultChecked={session.user.emailOffers}
              id="marketing"
            />
          </div>
          <Button className="w-full" onClick={() => setPhoneUpdateDialog(true)}>
            <Phone className="mr-2 h-4 w-4" /> Update Phone Number
          </Button>
        </CardContent>
      </Card>

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
    </>
  );
};

export default Account;
