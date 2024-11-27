import {signIn} from "@/auth";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import getSession from "@/lib/getSession";
import Link from "next/link";
import {redirect} from "next/navigation";

export default async function LoginForm({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getSession();
  const callbackUrl = searchParams.callbackUrl;
  if (session?.user) {
    redirect("/");
  }
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex items-center justify-center">
      <div className="w-full max-w-md space-y-8 p-8 bg-white shadow-lg rounded-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold">Sign in to Continue</h2>
          <p className="mt-2 text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              href={`/signup?callbackUrl=${callbackUrl}`}
              className="text-blue-600 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
        <form
          className="mt-8 space-y-6"
          action={async (formData: FormData) => {
            "use server";
            const email = formData.get("email");
            const password = formData.get("password");
            await signIn("credentials", {
              email,
              password,
              redirectTo: (callbackUrl as string) ?? "/",
            });
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="alan@example.com"
              required
              className="w-full"
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
              className="w-full"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-600 text-white hover:bg-blue-700"
          >
            Sign in
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">OR</div>

        <div className="mt-6 grid gap-3">
          <form
            action={async () => {
              "use server";
              await signIn("google", {
                redirectTo: (callbackUrl as string) ?? "/",
              });
            }}
          >
            <Button
              type="submit"
              variant="outline"
              className="w-full bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                className="mr-2 h-5 w-5"
                aria-hidden="true"
              >
                <path
                  fill="#FFC107"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                />
                <path
                  fill="#4CAF50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                />
              </svg>
              Sign in with Google
            </Button>
          </form>
        </div>
        <p className="mt-8 text-center text-xs text-gray-500">
          By signing in, you agree to our{" "}
          <Link href="/terms" className="text-blue-600 hover:underline">
            terms
          </Link>
          ,{" "}
          <Link
            href="/acceptable-use"
            className="text-blue-600 hover:underline"
          >
            acceptable use
          </Link>
          , and{" "}
          <Link href="/privacy" className="text-blue-600 hover:underline">
            privacy policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
