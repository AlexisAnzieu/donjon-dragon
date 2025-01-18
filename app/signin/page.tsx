import { SignIn } from "@/app/components/sign-in";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  const session = await auth();

  if (session) {
    redirect("/");
  }

  return <SignIn />;
}
