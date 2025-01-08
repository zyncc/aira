import {auth} from "@/auth";
import GoogleSignInButton from "@/components/SignIn/GoogleSignInButton";
import SignInForm from "@/components/SignIn/SignInForm";
import {headers} from "next/headers";
import Link from "next/link";
import {redirect} from "next/navigation";

export default async function LoginForm({
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
        <SignInForm callbackUrl={callbackUrl as string} />
        <div className="mt-6 text-center text-sm text-gray-500">OR</div>
        <div className="mt-6 grid gap-3">
          <GoogleSignInButton callbackUrl={callbackUrl as string} />
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
