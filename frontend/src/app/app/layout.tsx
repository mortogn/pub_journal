import AppSidebar, { SidebarItem } from "@/components/common/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

const AuthorSidebarItems: SidebarItem[] = [
  { label: "Dashboard", href: "/app/author/dashboard" },
  //   { label: "New Submission", href: "/app/author/submissions/create" },
  { label: "My Submissions", href: "/app/author/submissions" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar items={AuthorSidebarItems} />
      <div className="max-w-[960px] w-full mx-auto px-4 pb-4 mt-10">
        {children}
      </div>
    </SidebarProvider>
  );
}
