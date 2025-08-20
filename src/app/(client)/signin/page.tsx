import { getServerSession } from "@/functions/auth/get-server-session";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import SignInComponent from "./_components/SignInComponent";

export const metadata: Metadata = {
  title: "Sign up or Login to your account - Aira Clothing",
  description: "Login to your account to access your order history.",
};

export default async function SignInPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await getServerSession();
  const searchParams = await props.searchParams;
  const callbackUrl = searchParams.callbackUrl as string;
  if (session) {
    return redirect(callbackUrl || "/");
  }
  return <SignInComponent callbackUrl={callbackUrl as string} />;
}
