"use client";

import * as React from "react";

import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Mail, FileStack, BarChart4, Settings } from "lucide-react";
import Link from "next/link";
import Logo from "./Logo/Logo";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/useAuth";
import { ADMINS_ONLY, ALL_ROLES } from "@/types/Roles";
import { Skeleton } from "./ui/skeleton";
import { SidebarTranslations } from "@/hooks/translations/useSidebarTranslations";

import IconAdd from "../assets/sidebar-icons/add_16dp_E3E3E3 2.svg";
import IconBusiness from "../assets/sidebar-icons/business_16dp_E3E3E3 1.svg";
import IconSettings from "../assets/sidebar-icons/settings_16dp_E3E3E3 1.svg";
import IconAnalytics from "../assets/sidebar-icons/analytics_16dp_E3E3E3 1.svg";
import IconDescription from "../assets/sidebar-icons/description_16dp_E3E3E3 1.svg";
import IconDomainAdd from "../assets/sidebar-icons/domain_add_16dp_E3E3E3 1.svg";
import IconEmail from "../assets/sidebar-icons/email_16dp_E3E3E3 1.svg";
import IconGroupAdd from "../assets/sidebar-icons/group_add_16dp_E3E3E3 1.svg";
import IconGroups from "../assets/sidebar-icons/groups_16dp_E3E3E3 1.svg";
import IconHome from "../assets/sidebar-icons/home_16dp_E3E3E3 1.svg";
import IconList from "../assets/sidebar-icons/list_16dp_E3E3E3 1.svg";
import IconLogout from "../assets/sidebar-icons/logout_16dp_E3E3E3 1.svg";
import IconPeople from "../assets/sidebar-icons/people_16dp_E3E3E3 2.svg";
import IconPerson from "../assets/sidebar-icons/person_16dp_E3E3E3 1.svg";

const getIcon = (src?: string, size: number = 24) => {
  if (!src) return null;
  return (
    <Image
      src={src}
      alt="nav_icon"
      width={size}
      height={size}
      className={cn("shrink-0")}
    />
  );
};
export function AppSidebar({
  translations,
}: {
  translations: SidebarTranslations;
}) {
  return (
    <Sidebar className="border-none" collapsible="icon">
      <SidebarContentWithLogic translations={translations} />
    </Sidebar>
  );
}

const ICON_SIZE = 24;

export function SidebarContentWithLogic({
  translations,
}: {
  translations: SidebarTranslations;
}) {
  const { logout, user, isLoading } = useAuth({ enableFetch: true });
  const { open } = useSidebar();
  const pathname = usePathname();

  const data = {
    navMain: [
      {
        title: translations.home,
        url: "/dashboard/home",
        icon: IconHome,
        allowedRoles: ALL_ROLES,
      },

      {
        title: translations.accountGeneration,
        url: "#",
        items: [
          {
            title: translations.accountScenarios,
            url: "/dashboard/account-generation/account-scenarios",
            icon: IconPeople,
            allowedRoles: ALL_ROLES,
          },
          {
            title: translations.createAccountScenarios,
            url: "/dashboard/account-generation/create-account-scenarios",
            icon: IconGroupAdd,
            allowedRoles: ALL_ROLES,
            isSubItem: true,
          },
        ],
        icon: FileStack,
        allowedRoles: ALL_ROLES,
      },
      {
        title: translations.leadGeneration,
        url: "#",
        items: [
          {
            title: translations.leadScenarios,
            url: "/dashboard/lead-generation/lead-scenarios",
            icon: IconBusiness,
            allowedRoles: ALL_ROLES,
          },
          {
            title: translations.createLeadScenarios,
            url: "/dashboard/lead-generation/create-lead-scenarios",
            icon: IconDomainAdd,
            allowedRoles: ALL_ROLES,
            isSubItem: true,
          },
        ],
        icon: FileStack,
        allowedRoles: ALL_ROLES,
      },
      {
        title: translations.messagesGenerator,
        url: "#",
        items: [
          {
            title: translations.scenarioList,
            url: "/dashboard/scenario-list",
            icon: IconList,
            allowedRoles: ALL_ROLES,
          },
          {
            title: translations.createMessageScenario,
            url: "/dashboard/create-message-scenario",
            icon: IconAdd,
            allowedRoles: ALL_ROLES,
            isSubItem: true,
          },
          {
            title: translations.messageStructures,
            url: "/dashboard/messages/message-structures",
            icon: IconEmail,
            allowedRoles: ALL_ROLES,
          },
          {
            title: translations.createMessageStructures,
            url: "/dashboard/create-message-structures",
            icon: IconDescription,
            allowedRoles: ALL_ROLES,
            isSubItem: true,
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
            url: "/dashboard/account-list",
            icon: IconGroups,
            allowedRoles: ALL_ROLES,
          },
        ],
        icon: FileStack,
        allowedRoles: ALL_ROLES,
      },
      {
        title: translations.advancedAnalytics,
        url: "#",
        items: [
          {
            title: translations.analytics,
            url: "/dashboard/analytics",
            icon: IconAnalytics,
            allowedRoles: ALL_ROLES,
          },
        ],
        icon: BarChart4,
        allowedRoles: ALL_ROLES,
      },
      {
        title: translations.settings,
        url: "#",
        items: [
          {
            title: translations.companySettings,
            url: "/dashboard/company-settings",
            icon: IconSettings,
            allowedRoles: ALL_ROLES,
          },
          {
            title: translations.users,
            url: "/dashboard/users",
            icon: IconGroups,
            allowedRoles: ADMINS_ONLY,
          },
          {
            title: translations.myAccount,
            url: "/dashboard/profile",
            icon: IconPerson,
            allowedRoles: ALL_ROLES,
          },
        ],
        icon: Settings,
        allowedRoles: ALL_ROLES,
      },
    ],
  };

  return (
    <SidebarContent
      className={cn(
        "flex flex-col h-full gap-0 py-5 overflow-y-auto hide-scrollbar bg-slate-100",
        {
          "items-center": !open,
        }
      )}
    >
      <div
        className={cn("flex items-center justify-between mb-5 px-5", {
          "flex-col": !open,
          "gap-4": !open,
          "px-0": !open,
        })}
      >
        {open ? (
          <Logo width={100} height={40} />
        ) : (
          <Logo width={40} height={40} isCircleLogo />
        )}
        <SidebarTrigger />
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
              {index !== 0 && (
                <SidebarGroupLabel className="text-[12px] font-semibold">
                  {item.title}
                </SidebarGroupLabel>
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
                    .map(
                      (subItem: {
                        title: string;
                        url: string;
                        icon: string;
                        allowedRoles: string[];
                        isSubItem?: boolean;
                      }) => {
                        const isActive = pathname.includes(subItem.url);
                        return (
                          <SidebarMenuItem
                            key={subItem.title}
                            className={cn(
                              subItem.isSubItem &&
                                open &&
                                "relative ml-4 pl-1 before:absolute before:top-0 before:bottom-0 before:left-0 before:w-px before:bg-gray-300"
                            )}
                          >
                            <SidebarMenuButton
                              asChild
                              className="hover:bg-white"
                            >
                              <Link
                                href={subItem.url}
                                className={cn(
                                  "p-0 justify-center flex items-center gap-2 w-full rounded-md transition-colors",
                                  open && "p-0 justify-start",
                                  isActive
                                    ? "bg-white text-black"
                                    : "text-gray-700 hover:text-[#084960] hover:bg-[#084960]/10"
                                )}
                              >
                                {getIcon(subItem.icon, ICON_SIZE)}
                                {open && subItem.title}
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      }
                    )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
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

          <div className="flex flex-colgap-2 mt-3">
            <Button
              onClick={() => logout()}
              variant="link"
              className={cn(
                "flex gap-2 transition-all duration-200 text-[#EF476F]",
                !open && "p-2"
              )}
            >
              <Image
                width={24}
                alt="logout"
                height={24}
                className={cn("shrink-0", !open && "opacity-80")}
                src={IconLogout}
              />
              {open && translations.logout}
            </Button>
          </div>
        </>
      )}
    </SidebarContent>
  );
}
