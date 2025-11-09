import React from "react";
import LoginForm from "./_form";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account",
};

export default function SignInPage() {
  return (
    <div>
      <div className="my-4 space-y-1">
        <h1 className="text-xl font-semibold tracking-tight">Sign in</h1>
        <p className="tracking-wide text-sm text-muted-foreground">
          Welcome back! Please enter your credentials to access your account.
        </p>
      </div>
      <LoginForm />
      <div className="flex items-center justify-center flex-col mt-4 tracking-wide">
        <Link href="/forgot-password">
          <span className="text-sm text-primary hover:underline">
            Forgot your password? Reset it here
          </span>
        </Link>
        <Link href="/signup">
          <span className="text-sm text-primary hover:underline">
            Don&apos;t have an account? Sign up
          </span>
        </Link>
      </div>
    </div>
  );
}
