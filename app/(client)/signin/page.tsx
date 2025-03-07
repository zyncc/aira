import SignInComponent from "@/components/SignIn/SignInComponent";
import { getServerSession } from "@/lib/getServerSession";
import { redirect } from "next/navigation";

export default async function SignUpForm(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const session = await getServerSession();
  if (session?.session) {
    redirect("/");
  }
  const callbackUrl = searchParams.callbackUrl;
  return <SignInComponent callbackUrl={callbackUrl as string} />;
}
