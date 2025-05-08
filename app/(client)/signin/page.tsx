import SignInComponent from "@/components/SignIn/SignInComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign up or Login to your account - Aira Clothing",
};

export default async function SignInForm(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const callbackUrl = searchParams.callbackUrl;
  return <SignInComponent callbackUrl={callbackUrl as string} />;
}
