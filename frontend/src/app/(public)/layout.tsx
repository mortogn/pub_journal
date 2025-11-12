import React from "react";
import Header from "./_components/header";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-5xl mx-auto px-4">
      <Header />
      <main className="py-4">{children}</main>
    </div>
  );
}
