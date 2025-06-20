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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import React, { useState } from "react";
import { z } from "zod";
import { signInFormSchema, signUpFormSchema } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { signIn, signUp } from "@/lib/authClient";

function SignInComponent({ callbackUrl }: { callbackUrl: string }) {
  const signInForm = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
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

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [sentLink, setSentLink] = useState(false);
  const [sentSignUpLink, setSentSignUpLink] = useState(false);

  const onSignIn = async (values: z.infer<typeof signInFormSchema>) => {
    setLoading(true);
    const { email } = values;
    await signIn.magicLink({
      email,
      callbackURL: callbackUrl,
      fetchOptions: {
        onSuccess: () => {
          setSentLink(true);
        },
        onError: (ctx) => {
          toast.error("Error", {
            description: ctx.error.message,
            duration: 5000,
          });
          setLoading(false);
        },
      },
    });
    setLoading(false);
  };
  const onSignUp = async (values: z.infer<typeof signUpFormSchema>) => {
    setLoading(true);
    await signUp.email({
      name: values.name,
      email: values.email,
      password: values.phone,
      callbackURL: callbackUrl,
      fetchOptions: {
        onSuccess: () => {
          setLoading(true);
          setSentSignUpLink(true);
        },
        onError: (ctx) => {
          toast.error("Error", {
            description: ctx.error.message,
            duration: 5000,
          });
          setLoading(false);
        },
      },
    });
    setLoading(false);
  };
  return (
    <main className="relative h-[calc(100vh-70px)] w-screen">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-8 rounded-lg ">
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
                Enter your email to continue
              </p>
            </div>
            <Form {...signInForm}>
              <form
                onSubmit={signInForm.handleSubmit(onSignIn)}
                className="space-y-4"
              >
                {sentLink && (
                  <h1 className="font-medium text-blue-500 text-center text-sm">
                    Click on the link sent to your email to login
                  </h1>
                )}
                <FormField
                  control={signInForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="email" className="text-gray-700">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          id="email"
                          type="email"
                          placeholder="Email"
                          className="w-full placeholder:text-foreground"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  disabled={loading}
                  type="submit"
                  className="w-full text-white"
                >
                  {loading && (
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
                {sentSignUpLink && (
                  <h1 className="font-medium text-blue-500 text-center text-sm">
                    Click on the link sent to your email to verify your email
                  </h1>
                )}
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
                          id="name"
                          placeholder="Alan wake"
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
                          disabled={loading}
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
                  disabled={loading}
                  type="submit"
                  className="w-full  text-white"
                >
                  {loading && (
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
            className="mt-6 w-full hover:bg-background hover:text-muted-foreground"
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
              <LoaderCircle className={"animate-spin"} />
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
    </main>
  );
}

export default SignInComponent;
