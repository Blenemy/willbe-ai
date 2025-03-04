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
  SidebarProvider,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Card } from "@/components/ui/card";
import {
  Home,
  List,
  Mail,
  BarChart,
  Users,
  User,
  Settings,
  ChevronLeft,
  LucideProps,
} from "lucide-react";
import Link from "next/link";
import Logo from "./Logo/Logo";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/useAuth";
import { ADMINS_ONLY, ALL_ROLES } from "@/types/Roles";

const getIcon = (
  IconComponent: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >,
  size: number,
  isActive: boolean
) => (
  <IconComponent
    style={{ width: size, height: size }}
    className={isActive ? "text-black" : "text-gray-500"}
  />
);

const data = {
  navMain: [
    {
      title: "Home",
      url: "/dashboard/home",
      icon: Home,
      allowedRoles: ALL_ROLES,
    },
    {
      title: "Lead Generation",
      url: "#",
      items: [
        {
          title: "Account scenarios",
          url: "/dashboard/lead-generation/account-scenarios",
          icon: List,
          allowedRoles: ALL_ROLES,
        },
        {
          title: "Lead scenarios",
          url: "/dashboard/lead-generation/lead-scenarios",
          icon: Users,
          allowedRoles: ALL_ROLES,
        },
      ],
    },
    {
      title: "Messages generator",
      url: "#",
      items: [
        {
          title: "Scenario list (6)",
          url: "/dashboard/messages/scenario-list",
          icon: Mail,
          allowedRoles: ALL_ROLES,
        },
        {
          title: "Message structures",
          url: "/dashboard/messages/message-structures",
          icon: Settings,
          allowedRoles: ALL_ROLES,
        },
      ],
    },
    {
      title: "Data",
      url: "#",
      items: [
        {
          title: "Account List",
          url: "/dashboard/data/account-list",
          icon: List,
          allowedRoles: ALL_ROLES,
        },
      ],
    },
    {
      title: "Advanced analytics",
      url: "#",
      items: [
        {
          title: "Analytics",
          url: "/dashboard/analytics",
          icon: BarChart,
          allowedRoles: ALL_ROLES,
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      items: [
        {
          title: "Company settings",
          url: "/dashboard/company-settings",
          icon: Settings,
          allowedRoles: ALL_ROLES,
        },
        {
          title: "Users",
          url: "/dashboard/users",
          icon: Users,
          allowedRoles: ADMINS_ONLY,
        },
        {
          title: "My account",
          url: "/dashboard/profile",
          icon: User,
          allowedRoles: ALL_ROLES,
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [open, setOpen] = useState(true);
  const { logout, user } = useAuth({ enableFetch: true });
  const pathname = usePathname();
  const ICON_SIZE = open ? 24 : 20;

  return (
    <SidebarProvider
      open={open}
      className={cn("", {
        "max-w-64": open,
        "max-w-20": !open,
      })}
    >
      <Sidebar {...props} className="min-w-20" collapsible="icon">
        <SidebarContent
          className={cn("flex flex-col h-full gap-0 py-5", {
            "items-center": !open,
          })}
        >
          <div
            className={cn("flex items-center justify-center mb-5", {
              "flex-col": !open,
              "gap-4": !open,
            })}
          >
            {open ? (
              <Logo width={100} height={40} />
            ) : (
              <Logo width={40} height={40} isCircleLogo />
            )}
            <button onClick={() => setOpen((prev) => !prev)}>
              <ChevronLeft size={30} className={!open ? "rotate-180" : ""} />
            </button>
          </div>

          {data.navMain.map((item, index) => (
            <React.Fragment key={item.title}>
              <SidebarGroup className="py-3 flex flex-col">
                {open && index !== 0 && (
                  <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
                )}
                <SidebarGroupContent>
                  <SidebarMenu
                    className={cn("gap-3 flex flex-col", {
                      "items-center": !open,
                    })}
                  >
                    {(item.items || [item])
                      .filter(
                        (subItem) =>
                          !subItem.allowedRoles ||
                          subItem.allowedRoles.includes(user?.role)
                      )
                      .map((subItem) => {
                        const isActive = pathname.includes(subItem.url);
                        return (
                          <SidebarMenuItem key={subItem.title}>
                            <SidebarMenuButton asChild isActive={isActive}>
                              <Link
                                href={subItem.url}
                                className={cn(
                                  "p-0 justify-center flex items-center gap-2",
                                  {
                                    "p-2": open,
                                    "justify-start": open,
                                    "bg-gray-200 rounded-md": isActive,
                                  }
                                )}
                              >
                                {getIcon(subItem.icon, ICON_SIZE, isActive)}
                                {open && subItem.title}
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
              {index !== data.navMain.length - 1 && <SidebarSeparator />}
            </React.Fragment>
          ))}

          {open && (
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

          <div className="flex flex-col items-center gap-2 mt-3">
            {open && (
              <Button onClick={() => logout()} variant={"link"}>
                Log out
              </Button>
            )}
          </div>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}
