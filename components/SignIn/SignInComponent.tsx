"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
} from "@/components/ui/input-otp";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useState } from "react";
import { z } from "zod";
import { signUpFormSchema } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { emailOtp, phoneNumber, signIn, signUp } from "@/lib/authClient";

// Updated schema to accept either email or phone
export const signInFormSchema = z.object({
  emailOrPhone: z
    .string()
    .min(1, "Email or phone number is required")
    .refine(
      (value) => {
        // Check if it's a valid email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // Check if it's a valid Indian phone number
        const phoneRegex = /^[6-9]\d{9}$/;
        return emailRegex.test(value) || phoneRegex.test(value);
      },
      {
        message: "Please enter a valid email address or 10-digit phone number",
      }
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
        setOtp(""); // Reset OTP when dialog closes
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
        <div className="py-4 flex justify-center">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(value) => setOtp(value)}
            disabled={loading}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
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

  // Loading states
  const [phoneSignInLoading, setPhoneSignInLoading] = useState(false);
  const [emailSignInLoading, setEmailSignInLoading] = useState(false);
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

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
        await emailOtp.sendVerificationOtp({
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
        // For now, let's simulate the API call and directly open the dialog
        // You can uncomment and modify this when your API is ready

        // const checkIfUserExists = await fetch("/api/check-user", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({ phone: emailOrPhone }),
        // })
        // const userExists = await checkIfUserExists.json()

        // Simulate user exists check - remove this when you have the actual API
        const userExists = { exists: true };

        if (userExists.exists) {
          await phoneNumber.sendOtp({
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

    try {
      await signUp.email({
        name: values.name,
        email: values.email,
        password: values.phone, // You might want to change this
        callbackURL: callbackUrl,
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
    } catch (error) {
      toast.error("Error during sign up");
      setSignUpLoading(false);
    }
  };

  const handlePhoneOtpVerification = async (otp: string) => {
    setPhoneOtpLoading(true);
    try {
      await phoneNumber.verify({
        phoneNumber: currentPhone,
        code: otp,
        fetchOptions: {
          onSuccess: () => {
            toast.success("Phone verification successful!");
            setPhoneOtpDialog(false);
            setPhoneOtpLoading(false);
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
      await emailOtp.verifyEmail({
        email: currentEmail,
        otp,
        fetchOptions: {
          onSuccess: () => {
            toast.success("Email verification successful!");
            setEmailOtpDialog(false);
            setEmailOtpLoading(false);
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
      await emailOtp.verifyEmail({
        email: currentEmail,
        otp,
        fetchOptions: {
          onSuccess: () => {
            toast.success("Account verification successful!");
            setSignUpOtpDialog(false);
            setSignUpOtpLoading(false);
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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-8 rounded-lg">
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-secondary">
            <TabsTrigger value="signin">Sign in</TabsTrigger>
            <TabsTrigger value="signup">Sign up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <div className="space-y-2 text-center mb-6">
              <h1 className="text-2xl font-semibold tracking-tight">
                Welcome back
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your email or phone number to continue
              </p>
            </div>

            <Form {...signInForm}>
              <form
                onSubmit={signInForm.handleSubmit(onSignIn)}
                className="space-y-4"
              >
                <FormField
                  control={signInForm.control}
                  name="emailOrPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        htmlFor="emailOrPhone"
                        className="text-gray-700"
                      >
                        Email or Phone Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isSignInLoading}
                          id="emailOrPhone"
                          type="text"
                          placeholder="Enter email or phone number"
                          className="w-full placeholder:text-foreground"
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
            <div className="space-y-2 text-center mb-6">
              <h1 className="text-2xl font-semibold tracking-tight">
                Create an account
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your information to get started
              </p>
            </div>

            <Form {...signUpForm}>
              <form
                onSubmit={signUpForm.handleSubmit(onSignUp)}
                className="space-y-4"
              >
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
                          className="w-full placeholder:text-foreground"
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
              <span className="px-2 bg-secondary rounded-sm text-muted-foreground">
                OR
              </span>
            </div>
          </div>

          <Button
            disabled={googleLoading}
            variant="outline"
            className="mt-6 w-full hover:bg-background hover:text-muted-foreground bg-transparent"
            onClick={async () => {
              setGoogleLoading(true);
              await signIn.social({
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
            {googleLoading ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48">
                <path
                  fill="#FFC107"
                  d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
                />
                <path
                  fill="#FF3D00"
                  d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"
                />
                <path
                  fill="#4CAF50"
                  d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
                />
              </svg>
            )}
            Continue with Google
          </Button>

          <p className="mt-6 text-xs text-center text-gray-600">
            By signing up, you agree to our{" "}
            <Link
              rel="nofollow"
              href="/terms"
              className="text-blue-600 hover:underline"
            >
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
