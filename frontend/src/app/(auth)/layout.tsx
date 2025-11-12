import Logo from "@/components/common/logo";
import Link from "next/link";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-md mx-auto flex flex-col items-center justify-center min-h-screen px-4">
      <Link href="/">
        <Logo />
      </Link>
      <div className="w-full">{children}</div>
    </div>
  );
}
