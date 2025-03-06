import { auth } from "@/auth";
import SignInComponent from "@/components/SignIn/SignInComponent";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function SignUpForm(
  props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  }
) {
  const searchParams = await props.searchParams;
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (session?.session) {
    redirect("/");
  }
  const callbackUrl = searchParams.callbackUrl;
  return <SignInComponent callbackUrl={callbackUrl as string} />;
}
