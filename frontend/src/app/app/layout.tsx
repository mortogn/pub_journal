import AppSidebar, { SidebarItem } from "@/components/common/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import api from "@/lib/api";
import { User } from "@/types";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

const AuthorSidebarItems: SidebarItem[] = [
  { label: "Dashboard", href: "/app/author/dashboard" },
  //   { label: "New Submission", href: "/app/author/submissions/create" },
  { label: "My Submissions", href: "/app/author/submissions" },
];

const AdminSidebarItems: SidebarItem[] = [
  { label: "Dashboard", href: "/app/admin/dashboard" },
  { label: "Manage Users", href: "/app/admin/users" },
];

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authToken = await getCookie("ac-token", { cookies });

  if (!authToken) {
    redirect("/signin");
  }

  const { data: me } = await api<User>(`/users/me`, {
    method: "GET",
    headers: {
      authorization: `Bearer ${authToken}`,
    },
  });

  return (
    <SidebarProvider>
      <AppSidebar items={getSidebarItemsForRole(me?.role)} />
      <div className="max-w-[960px] w-full mx-auto px-4 pb-4 mt-10">
        {children}
      </div>
    </SidebarProvider>
  );
}

function getSidebarItemsForRole(role: string | undefined): SidebarItem[] {
  switch (role) {
    case "AUTHOR":
      return AuthorSidebarItems;
    case "ADMIN":
      return AdminSidebarItems;
    default:
      return [];
  }
}
