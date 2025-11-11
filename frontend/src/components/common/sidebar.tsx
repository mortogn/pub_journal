import React, { FC } from "react";
import {
  Sidebar,
  SidebarContent,
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

export type SidebarItem = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

type Props = {
  items: Array<SidebarItem>;
};

const AppSidebar: FC<Props> = ({ items }) => {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarHeader className="flex items-center justify-center my-2">
          <span className="scale-[0.75]">
            <Logo />
          </span>
        </SidebarHeader>
        <SidebarGroup>
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
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
