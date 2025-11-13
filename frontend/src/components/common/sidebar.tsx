"use client";

import React, { FC } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import Link from "next/link";
import Logo from "./logo";
import { useAuthContext } from "@/contexts/auth-context";
import { LogOutIcon, UserIcon } from "lucide-react";
import { Button } from "../ui/button";

export type SidebarItem = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

type Props = {
  items: Array<SidebarItem>;
};

const AppSidebar: FC<Props> = ({ items }) => {
  const { currentUser } = useAuthContext();
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarHeader className="flex items-center justify-center my-2">
          <span className="scale-[0.75]">
            <Logo />
          </span>
        </SidebarHeader>
        <SidebarGroup className="flex-1">
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild>
                    <Link href={item.href}>
                      <span>{item.icon}</span>
                      <span className="ml-2 inline-block">{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarFooter className="h-max mb-4">
          <SidebarMenuItem>
            <div className="flex items-center justify-between bg-secondary border-border p-3 rounded-xl text-sm">
              <div className="flex items-center gap-1">
                <span className="p-2 rounded-full bg-primary text-primary-foreground">
                  <UserIcon className="size-4" />
                </span>
                <span className="ml-2">{currentUser?.fullname}</span>
              </div>
              <span>
                <Button size="icon" variant="ghost" className="ml-4">
                  <LogOutIcon className="size-4" />
                </Button>
              </span>
            </div>
          </SidebarMenuItem>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
