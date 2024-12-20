import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";
import SignUpFormComponent from "./signupform";
import { headers } from "next/headers";
import { signIn, signUp } from "@/lib/authClient";
import GoogleSignInButton from "@/components/SignIn/GoogleSignInButton";

export default async function SignUpForm({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await auth.api.getSession({
    headers: headers(),
  });
  const callbackUrl = searchParams.callbackUrl;
  if (session?.user) {
    redirect("/");
  }
  return (
    <div className="min-h-screen text-gray-900 flex items-center justify-center">
      <div className="w-full max-w-md space-y-8 p-8 bg-secondary shadow-lg rounded-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold">Create an account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href={`/signin?callbackUrl=${callbackUrl}`}
              className="text-blue-600 hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
        <SignUpFormComponent callbackUrl={callbackUrl} />
        <div className="mt-6 text-center text-sm text-gray-500">OR</div>
        <div className="mt-6 grid gap-3">
          <GoogleSignInButton callbackUrl={callbackUrl as string} />
        </div>
        <p className="mt-8 text-center text-xs text-gray-500">
          By signing up, you agree to our{" "}
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
