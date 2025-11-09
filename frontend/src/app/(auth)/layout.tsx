import Logo from "@/components/common/logo";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-md mx-auto flex flex-col items-center justify-center min-h-screen px-4">
      <Logo />
      <div className="w-full">{children}</div>
    </div>
  );
}
