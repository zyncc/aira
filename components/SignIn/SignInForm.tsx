"use client";

import React from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { signIn } from "@/lib/authClient";
import { Button } from "../ui/button";

export default function SignInForm({ callbackUrl }: { callbackUrl: string }) {
  async function handleForm(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    await signIn.email({
      email,
      password,
      callbackURL: callbackUrl as string,
    });
  }
  return (
    <form
      className="mt-8 space-y-6"
      action={(formData: FormData) => handleForm(formData)}
    >
      <div className="space-y-2">
        <Label htmlFor="email" className="text-gray-700">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="alan@gmail.com"
          required
          className="w-full placeholder:text-muted-foreground"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" className="text-gray-700">
          Password
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="●●●●●●●●"
          required
          className="w-full placeholder:text-muted-foreground"
        />
      </div>
      <Button type="submit" className="w-full bg-muted text-white">
        Sign in
      </Button>
    </form>
  );
}
