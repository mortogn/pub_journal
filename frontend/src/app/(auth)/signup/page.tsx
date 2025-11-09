import SignUpForm from "./_form";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create a new account",
};

export default function SignUpPage() {
  return (
    <div>
      <div className="my-4 space-y-1">
        <h1 className="text-xl font-semibold tracking-tight">Sign up</h1>
        <p className="tracking-wide text-sm text-muted-foreground">
          Create your account to get started with your journal.
        </p>
      </div>
      <SignUpForm />
      <div className="flex items-center justify-center flex-col mt-4 tracking-wide">
        <Link href="/signin">
          <span className="text-sm text-primary hover:underline">
            Already have an account? Sign in
          </span>
        </Link>
      </div>
    </div>
  );
}
