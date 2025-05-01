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
import { Skeleton } from "./ui/skeleton";
import { SidebarTranslations } from "@/hooks/translations/useSidebarTranslations";

const getIcon = (
  IconComponent?: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >,
  size: number = 20,
  isActive: boolean = false
): React.JSX.Element | null => {
  if (!IconComponent) return null;

  return (
    <IconComponent
      style={{ width: size, height: size }}
      className={cn("rounded p-1", {
        "text-white": isActive,
        "text-gray-500": !isActive,
      })}
    />
  );
};

export function AppSidebar({
  translations,
}: {
  translations: SidebarTranslations;
}) {
  const [open, setOpen] = useState(true);
  const { logout, user, isLoading } = useAuth({ enableFetch: true });
  const pathname = usePathname();
  const ICON_SIZE = open ? 24 : 20;

  const data = {
    navMain: [
      {
        title: translations.home,
        url: "/dashboard/home",
        icon: Home,
        allowedRoles: ALL_ROLES,
      },
      {
        title: translations.leadGeneration,
        url: "#",
        items: [
          {
            title: translations.leadScenarios,
            url: "/dashboard/lead-generation/lead-scenarios",
            icon: List,
            allowedRoles: ALL_ROLES,
          },
          {
            title: translations.createLeadScenarios,
            url: "/dashboard/lead-generation/create-lead-scenarios",
            icon: Users,
            allowedRoles: ALL_ROLES,
          },
        ],
        icon: List,
        allowedRoles: ALL_ROLES,
      },
      {
        title: translations.accountGeneration,
        url: "#",
        items: [
          {
            title: translations.accountScenarios,
            url: "/dashboard/account-generation/account-scenarios",
            icon: List,
            allowedRoles: ALL_ROLES,
          },
          {
            title: translations.createAccountScenarios,
            url: "/dashboard/account-generation/create-account-scenarios",
            icon: Users,
            allowedRoles: ALL_ROLES,
          },
        ],
        icon: List,
        allowedRoles: ALL_ROLES,
      },
      {
        title: translations.messagesGenerator,
        url: "#",
        items: [
          {
            title: translations.scenarioList,
            url: "/dashboard/scenario-list",
            icon: List,
            allowedRoles: ALL_ROLES,
          },
          {
            title: translations.createMessageScenario,
            url: "/dashboard/create-message-scenario",
            allowedRoles: ALL_ROLES,
          },
          {
            title: translations.messageStructures,
            url: "/dashboard/messages/message-structures",
            icon: Mail,
            allowedRoles: ALL_ROLES,
          },
          {
            title: translations.createMessageStructures,
            url: "/dashboard/create-message-structures",
            allowedRoles: ALL_ROLES,
          },
        ],
        icon: Mail,
        allowedRoles: ALL_ROLES,
      },
      {
        title: translations.data,
        url: "#",
        items: [
          {
            title: translations.accountList,
            url: "/dashboard/data/account-list",
            icon: List,
            allowedRoles: ALL_ROLES,
          },
        ],
        icon: List,
        allowedRoles: ALL_ROLES,
      },
      {
        title: translations.advancedAnalytics,
        url: "#",
        items: [
          {
            title: translations.analytics,
            url: "/dashboard/analytics",
            icon: BarChart,
            allowedRoles: ALL_ROLES,
          },
        ],
        icon: BarChart,
        allowedRoles: ALL_ROLES,
      },
      {
        title: translations.settings,
        url: "#",
        items: [
          {
            title: translations.companySettings,
            url: "/dashboard/company-settings",
            icon: Settings,
            allowedRoles: ALL_ROLES,
          },
          {
            title: translations.users,
            url: "/dashboard/users",
            icon: Users,
            allowedRoles: ADMINS_ONLY,
          },
          {
            title: translations.myAccount,
            url: "/dashboard/profile",
            icon: User,
            allowedRoles: ALL_ROLES,
          },
        ],
        icon: Settings,
        allowedRoles: ALL_ROLES,
      },
    ],
  };

  return (
    <SidebarProvider
      open={open}
      className={cn("", {
        "max-w-64": open,
        "max-w-20": !open,
      })}
    >
      <Sidebar className="min-w-20 border-none" collapsible="icon">
        <SidebarContent
          className={cn(
            "flex flex-col h-full gap-0 py-5 overflow-y-auto hide-scrollbar bg-slate-100 ",
            {
              "items-center": !open,
            }
          )}
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

          {isLoading ? (
            <SidebarMenu className="gap-4 flex flex-col mb-5">
              {Array.from({ length: 10 }).map((_, index) => (
                <SidebarMenuItem key={index}>
                  <Skeleton className="w-full h-8 bg-gray-200" />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          ) : (
            data.navMain.map((item, index) => (
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
                              <SidebarMenuButton asChild>
                                <Link
                                  href={subItem.url}
                                  className={cn(
                                    "p-0 justify-center flex items-center gap-2 w-full rounded-md transition-colors",
                                    {
                                      "p-2": open,
                                      "justify-start": open,
                                      "bg-[#084960] text-white": isActive,
                                      "text-gray-700 hover:text-[#084960] hover:bg-[#084960]/10":
                                        !isActive,
                                      "hover:text-white hover:bg-[#084960]":
                                        isActive,
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
            ))
          )}

          {isLoading ? (
            <div className="flex flex-col gap-2 items-center">
              <Skeleton className="w-full h-52 bg-gray-200" />
              <Skeleton className="w-1/2 h-12 bg-gray-200 rounded-md" />
            </div>
          ) : (
            <>
              {/* {open && (
                <div className="p-4 mt-auto">
                  <Card className="p-4 text-sm flex flex-col gap-3">
                    <p className="font-semibold">Available credits</p>
                    <p>
                      Account generation: <span className="font-bold">97</span>
                    </p>
                    <p className="text-xs text-gray-500">(Renews to: al mes)</p>
                  </Card>
                </div>
              )} */}

              <div className="flex flex-col items-center gap-2 mt-3">
                {open && (
                  <Button onClick={() => logout()} variant={"link"}>
                    {translations.logout}
                  </Button>
                )}
              </div>
            </>
          )}
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}
