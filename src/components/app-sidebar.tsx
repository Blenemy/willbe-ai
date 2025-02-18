"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Card } from "@/components/ui/card";
import {
  Home,
  List,
  Mail,
  BarChart,
  Users,
  Settings,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import Logo from "./Logo/Logo";
import { useState } from "react";
import { cn } from "@/lib/utils";

const ICON_SIZE = 25;

const data = {
  navMain: [
    {
      title: "Home",
      url: "/dashboard",
      isSingle: true,
      icon: <Home size={ICON_SIZE} />,
    },
    {
      title: "Lead Generation",
      url: "#",
      items: [
        {
          title: "Account scenarios",
          url: "#",
          icon: <List size={ICON_SIZE} />,
        },
        {
          title: "Lead scenarios",
          url: "#",
          isActive: true,
          icon: <Users size={ICON_SIZE} />,
        },
      ],
    },
    {
      title: "Messages generator",
      url: "#",
      items: [
        {
          title: "Scenario list (6)",
          url: "#",
          icon: <Mail size={ICON_SIZE} />,
        },
        {
          title: "Message structures",
          url: "#",
          icon: <Settings size={ICON_SIZE} />,
        },
      ],
    },
    {
      title: "Data",
      url: "#",
      items: [
        {
          title: "Account List",
          url: "#",
          icon: <List size={ICON_SIZE} />,
        },
      ],
    },
    {
      title: "Advanced analytics",
      url: "#",
      items: [
        {
          title: "Analytics",
          url: "#",
          icon: <BarChart size={ICON_SIZE} />,
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      items: [
        {
          title: "Willbe",
          url: "#",
          icon: <Settings size={ICON_SIZE} />,
        },
        {
          title: "Users",
          url: "#",
          icon: <Users size={ICON_SIZE} />,
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Sidebar {...props} className={collapsed ? "w-20" : "w-64"}>
      <SidebarContent className="flex flex-col h-full gap-0 py-5">
        <div
          className={cn("flex items-center justify-center mb-5", {
            "flex-col": collapsed,
            "gap-2": collapsed,
          })}
        >
          <Logo width={collapsed ? 40 : 100} height={40} />
          <button onClick={() => setCollapsed(!collapsed)}>
            <ChevronLeft size={30} className={collapsed ? "rotate-180" : ""} />
          </button>
        </div>
        <SidebarSeparator />
        <SidebarGroup className="p-0 xmd:p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link
                  href="/dashboard"
                  className={cn("p-0, justify-center", {
                    "p-2": !collapsed,
                    "justify-start": !collapsed,
                  })}
                >
                  {data.navMain[0].icon} {!collapsed && data.navMain[0].title}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarSeparator />
        {data.navMain
          .filter((item) => !item.isSingle)
          .map((item) => (
            <React.Fragment key={item.title}>
              <SidebarGroup>
                {!collapsed && (
                  <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
                )}

                <SidebarGroupContent>
                  <SidebarMenu>
                    {item.items?.map((subItem) => (
                      <SidebarMenuItem key={subItem.title}>
                        <SidebarMenuButton asChild isActive={subItem.isActive}>
                          <Link
                            href={subItem.url}
                            className={cn("p-0, justify-center", {
                              "p-2": !collapsed,
                              "justify-start": !collapsed,
                            })}
                          >
                            {subItem.icon} {!collapsed && subItem.title}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
              <SidebarSeparator />
            </React.Fragment>
          ))}

        {!collapsed && (
          <div className="p-4 mt-auto">
            <Card className="p-4 text-sm flex flex-col gap-3">
              <p className="font-semibold">Available credits</p>
              <p>
                Account generation: <span className="font-bold">97</span>
              </p>
              <p className="text-xs text-gray-500">(Renews to: al mes)</p>
            </Card>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
