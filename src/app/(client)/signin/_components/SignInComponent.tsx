"use client";

import { authClient } from "@/auth/auth-client";
import GoogleOneTap from "@/components/google-one-tap";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signUpFormSchema } from "@/lib/zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { LoaderCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaXTwitter } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import { z } from "zod";

export const signInFormSchema = z.object({
  emailOrPhone: z
    .string()
    .min(1, "Email or phone number is required")
    .refine(
      (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[6-9]\d{9}$/;
        return emailRegex.test(value) || phoneRegex.test(value);
      },
      {
        message: "Please enter a valid email address or 10-digit phone number",
      },
    ),
});

interface OTPDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onSubmit: (otp: string) => void;
  loading: boolean;
}

function OTPDialog({
  open,
  onOpenChange,
  title,
  description,
  onSubmit,
  loading,
}: OTPDialogProps) {
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
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex justify-center py-4">
          <InputOTP
            pattern={REGEXP_ONLY_DIGITS}
            maxLength={6}
            value={otp}
            onChange={(value) => setOtp(value)}
            disabled={loading}
            autoFocus
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
            Verify OTP
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function SignInComponent({ callbackUrl }: { callbackUrl: string }) {
  const signInForm = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      emailOrPhone: "",
    },
  });

  const signUpForm = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const router = useRouter();

  // Loading states
  const [phoneSignInLoading, setPhoneSignInLoading] = useState(false);
  const [emailSignInLoading, setEmailSignInLoading] = useState(false);
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [twitterLoading, setTwitterLoading] = useState(false);

  // OTP verification loading states
  const [phoneOtpLoading, setPhoneOtpLoading] = useState(false);
  const [emailOtpLoading, setEmailOtpLoading] = useState(false);
  const [signUpOtpLoading, setSignUpOtpLoading] = useState(false);

  // Dialog states
  const [phoneOtpDialog, setPhoneOtpDialog] = useState(false);
  const [emailOtpDialog, setEmailOtpDialog] = useState(false);
  const [signUpOtpDialog, setSignUpOtpDialog] = useState(false);

  // Store the current input for OTP verification
  const [currentPhone, setCurrentPhone] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");

  const isEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const isPhone = (value: string) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(value);
  };

  const onSignIn = async (values: z.infer<typeof signInFormSchema>) => {
    const { emailOrPhone } = values;

    if (isEmail(emailOrPhone)) {
      // Handle email sign in
      setEmailSignInLoading(true);
      setCurrentEmail(emailOrPhone);

      try {
        await authClient.emailOtp.sendVerificationOtp({
          email: emailOrPhone,
          type: "sign-in",
          fetchOptions: {
            onSuccess: () => {
              setEmailOtpDialog(true);
              setEmailSignInLoading(false);
            },
            onError: (ctx) => {
              toast.error("Error", {
                description: ctx.error.message,
                duration: 5000,
              });
              setEmailSignInLoading(false);
            },
          },
        });
      } catch (error) {
        toast.error("Error sending email OTP");

        setEmailSignInLoading(false);
      }
    } else if (isPhone(emailOrPhone)) {
      // Handle phone sign in
      setPhoneSignInLoading(true);
      setCurrentPhone(emailOrPhone);

      try {
        const checkIfUserExists = await fetch(
          `/api/user/check-phone?phoneNumber=${emailOrPhone}`,
        );
        const userExists: boolean = await checkIfUserExists.json();

        if (userExists) {
          await authClient.phoneNumber.sendOtp({
            phoneNumber: emailOrPhone,
            fetchOptions: {
              onSuccess: () => {
                setPhoneOtpDialog(true);
                setPhoneSignInLoading(false);
              },
              onError(context) {
                toast.error("Error", {
                  description: context.error.message,
                  duration: 5000,
                });
                setPhoneSignInLoading(false);
              },
            },
          });
        } else {
          toast.error("User with this phone number does not exist");
          setPhoneSignInLoading(false);
        }
      } catch (error) {
        toast.error("Error checking user existence");

        setPhoneSignInLoading(false);
      }
    }
  };

  const onSignUp = async (values: z.infer<typeof signUpFormSchema>) => {
    setSignUpLoading(true);
    setCurrentEmail(values.email);
    try {
      await authClient.signUp.email({
        name: values.name,
        email: values.email,
        password: values.phone,
        phoneNumber: values.phone,
        emailOffers: true,
        callbackURL: callbackUrl,
        fetchOptions: {
          onSuccess: async () => {
            await authClient.emailOtp.sendVerificationOtp({
              email: values.email,
              type: "sign-in",
              fetchOptions: {
                onSuccess: () => {
                  setSignUpOtpDialog(true);
                  setSignUpLoading(false);
                },
                onError: (ctx) => {
                  toast.error("Error", {
                    description: ctx.error.message,
                    duration: 5000,
                  });
                  setSignUpLoading(false);
                },
              },
            });
          },
          onError: (ctx) => {
            toast.error("Error", {
              description: ctx.error.message,
              duration: 5000,
            });
            setSignUpLoading(false);
          },
        },
      });
    } catch (error) {
      toast.error("Error during sign up");

      setSignUpLoading(false);
    }
  };

  const handlePhoneOtpVerification = async (otp: string) => {
    setPhoneOtpLoading(true);
    try {
      await authClient.phoneNumber.verify({
        phoneNumber: currentPhone,
        code: otp,
        disableSession: false,
        fetchOptions: {
          onSuccess: () => {
            setPhoneOtpDialog(false);
            setPhoneOtpLoading(false);
            router.push(callbackUrl);
          },
          onError: (context) => {
            toast.error("Error", {
              description: context.error.message,
              duration: 5000,
            });
            setPhoneOtpLoading(false);
          },
        },
      });
    } catch (error) {
      toast.error("Error verifying OTP");

      setPhoneOtpLoading(false);
    }
  };

  const handleEmailOtpVerification = async (otp: string) => {
    setEmailOtpLoading(true);
    try {
      await authClient.signIn.emailOtp({
        email: currentEmail,
        otp,
        fetchOptions: {
          onSuccess: () => {
            setEmailOtpDialog(false);
            setEmailOtpLoading(false);
            router.push(callbackUrl);
          },
          onError: (context) => {
            toast.error("Error", {
              description: context.error.message,
              duration: 5000,
            });
            setEmailOtpLoading(false);
          },
        },
      });
    } catch (error) {
      toast.error("Error verifying OTP");

      setEmailOtpLoading(false);
    }
  };

  const handleSignUpOtpVerification = async (otp: string) => {
    setSignUpOtpLoading(true);
    try {
      await authClient.signIn.emailOtp({
        email: currentEmail,
        otp,
        fetchOptions: {
          onSuccess: () => {
            setSignUpOtpDialog(false);
            setSignUpOtpLoading(false);
            router.push(callbackUrl);
          },
          onError: (context) => {
            toast.error("Error", {
              description: context.error.message,
              duration: 5000,
            });
            setSignUpOtpLoading(false);
          },
        },
      });
    } catch (error) {
      toast.error("Error verifying sign up OTP");

      setSignUpOtpLoading(false);
    }
  };

  const isSignInLoading = phoneSignInLoading || emailSignInLoading;

  return (
    <main className="relative h-[calc(100vh-70px)] w-screen">
      <GoogleOneTap />
      <div className="absolute top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg p-8">
        <div className="my-7 flex items-center justify-center">
          <Image src={"/logo.png"} alt="Logo" width={100} height={100} />
        </div>
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="bg-secondary mb-6 grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign in</TabsTrigger>
            <TabsTrigger value="signup">Sign up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <div className="mb-6 space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
              <p className="text-muted-foreground text-sm">
                Enter your email or phone number to continue
              </p>
            </div>

            <Form {...signInForm}>
              <form onSubmit={signInForm.handleSubmit(onSignIn)} className="space-y-4">
                <FormField
                  control={signInForm.control}
                  name="emailOrPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="emailOrPhone" className="text-gray-700">
                        Email or Phone Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isSignInLoading}
                          id="emailOrPhone"
                          type="text"
                          placeholder="Enter email or phone number"
                          className="placeholder:text-foreground w-full"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  disabled={isSignInLoading}
                  type="submit"
                  className="w-full text-white"
                >
                  {isSignInLoading && (
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Sign in
                </Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="signup">
            <div className="mb-6 space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
              <p className="text-muted-foreground text-sm">
                Enter your information to get started
              </p>
            </div>

            <Form {...signUpForm}>
              <form onSubmit={signUpForm.handleSubmit(onSignUp)} className="space-y-4">
                <FormField
                  control={signUpForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="name" className="text-gray-700">
                        Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={signUpLoading}
                          id="name"
                          placeholder="Alan Wake"
                          className="text-black"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={signUpForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="email" className="text-gray-700">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={signUpLoading}
                          id="email"
                          type="email"
                          placeholder="alan@gmail.com"
                          className="placeholder:text-foreground w-full"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={signUpForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="phone" className="text-gray-700">
                        Phone
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={signUpLoading}
                          id="phone"
                          type="tel"
                          placeholder="Enter your phone number"
                          className="text-black"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  disabled={signUpLoading}
                  type="submit"
                  className="w-full text-white"
                >
                  {signUpLoading && (
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Sign up
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-secondary text-muted-foreground rounded-sm px-2">
                OR
              </span>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-x-3">
            <Button
              disabled={googleLoading}
              variant="outline"
              className="flex-1 bg-transparent hover:bg-transparent"
              onClick={async () => {
                setGoogleLoading(true);
                await authClient.signIn.social({
                  provider: "google",
                  callbackURL: callbackUrl,
                  fetchOptions: {
                    onError() {
                      toast.error("Error", {
                        description: "Something went wrong",
                        duration: 5000,
                      });
                      setGoogleLoading(false);
                    },
                    onSuccess() {
                      setGoogleLoading(false);
                    },
                  },
                });
              }}
            >
              {googleLoading ? <LoaderCircle className="animate-spin" /> : <FcGoogle />}
            </Button>
            <Button
              disabled={twitterLoading}
              variant="outline"
              className="flex-1 border-black bg-black text-white hover:bg-black"
              onClick={async () => {
                setTwitterLoading(true);
                await authClient.signIn.social({
                  provider: "twitter",
                  callbackURL: callbackUrl,
                  fetchOptions: {
                    onError() {
                      toast.error("Error", {
                        description: "Something went wrong",
                        duration: 5000,
                      });
                      setTwitterLoading(false);
                    },
                    onSuccess() {
                      setTwitterLoading(false);
                    },
                  },
                });
              }}
            >
              {twitterLoading ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                <FaXTwitter />
              )}
            </Button>
          </div>
          <p className="mt-6 text-center text-xs text-gray-600">
            By signing up, you agree to our{" "}
            <Link rel="nofollow" href="/terms" className="text-blue-600 hover:underline">
              terms
            </Link>
            ,{" "}
            <Link
              rel="nofollow"
              href="/privacy"
              className="text-blue-600 hover:underline"
            >
              privacy policy
            </Link>
            .
          </p>
        </div>
      </div>

      {/* Phone OTP Dialog */}
      <OTPDialog
        open={phoneOtpDialog}
        onOpenChange={setPhoneOtpDialog}
        title="Verify Phone Number"
        description={`Enter the 6-digit OTP sent to ${currentPhone}`}
        onSubmit={handlePhoneOtpVerification}
        loading={phoneOtpLoading}
      />

      {/* Email OTP Dialog */}
      <OTPDialog
        open={emailOtpDialog}
        onOpenChange={setEmailOtpDialog}
        title="Verify Email"
        description={`Enter the 6-digit OTP sent to ${currentEmail}`}
        onSubmit={handleEmailOtpVerification}
        loading={emailOtpLoading}
      />

      {/* Sign Up OTP Dialog */}
      <OTPDialog
        open={signUpOtpDialog}
        onOpenChange={setSignUpOtpDialog}
        title="Verify Your Account"
        description="Enter the 6-digit OTP sent to your email to complete registration"
        onSubmit={handleSignUpOtpVerification}
        loading={signUpOtpLoading}
      />
    </main>
  );
}

export default SignInComponent;
