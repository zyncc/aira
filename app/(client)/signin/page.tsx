import { auth } from "@/auth";
import SignInComponent from "@/components/SignIn/SignInComponent";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function SignUpForm({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await auth.api.getSession({
    headers: headers(),
  });
  if (!session?.session) {
    redirect("/");
  }
  const callbackUrl = searchParams.callbackUrl;
  return <SignInComponent callbackUrl={callbackUrl as string} />;
}
