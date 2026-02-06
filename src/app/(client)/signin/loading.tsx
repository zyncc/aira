import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { FaXTwitter } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";

export default function AuthSkeleton() {
  return (
    <main className="relative h-[calc(100vh-70px)] w-screen">
      <div className="absolute top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg p-8">
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="bg-secondary mb-6 grid w-full grid-cols-2">
            <TabsTrigger value="signin" disabled>
              Sign in
            </TabsTrigger>
            <TabsTrigger value="signup" disabled>
              Sign up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <div className="mb-6 space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
              <p className="text-muted-foreground text-sm">
                Enter your email to continue
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Email" disabled />
              </div>

              <Button className="w-full" disabled>
                Sign in
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="signup">
            <div className="mb-6 space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
              <p className="text-muted-foreground text-sm">
                Enter your information to get started
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" type="text" placeholder="Name" disabled />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input id="signup-email" type="email" placeholder="Email" disabled />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Password" disabled />
              </div>

              <Button className="w-full" disabled>
                Create Account
              </Button>
            </div>
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
            <Button variant="outline" className="flex-1 bg-transparent" disabled>
              <FcGoogle />
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent" disabled>
              <FaXTwitter />
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
    </main>
  );
}
