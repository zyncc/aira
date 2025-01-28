import SignInComponent from "@/components/SignIn/SignInComponent";

export default async function SignUpForm({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const callbackUrl = searchParams.callbackUrl;
  return <SignInComponent callbackUrl={callbackUrl as string} />;
}
