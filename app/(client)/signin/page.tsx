import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import SignInComponent from "@/components/SignIn/SignInComponent";

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
  return <SignInComponent callbackUrl={callbackUrl as string} />;
}
