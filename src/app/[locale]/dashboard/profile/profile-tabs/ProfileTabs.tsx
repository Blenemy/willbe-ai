"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/store/useAuthStore";
import ProfileTab from "../tabs/ProfileTab";
import SecurityTab from "../tabs/SecurityTab";
import ConnectionsTab from "../tabs/ConnectionsTab";
import SignatureTab from "../tabs/SignatureTab";
import { ALL_ROLES } from "@/types/Roles";
import { hasPermission } from "@/utils/hasPermission/hasPermission";

interface Props {
  translations: {
    tab_profile: string;
    tab_security: string;
    tab_connections: string;
    tab_signature: string;
    account_settings: string;
  };
}

const ProfileTabs = ({ translations }: Props) => {
  const { user } = useAuthStore();

  const tabsConfig = [
    {
      value: "profile",
      label: translations.tab_profile,
      component: <ProfileTab />,
      roles: ALL_ROLES,
    },
    {
      value: "security",
      label: translations.tab_security,
      component: <SecurityTab />,
      roles: ALL_ROLES,
    },
    {
      value: "connections",
      label: translations.tab_connections,
      component: <ConnectionsTab />,
      roles: ALL_ROLES,
    },
    {
      value: "e-signature",
      label: translations.tab_signature,
      component: <SignatureTab />,
      roles: ALL_ROLES,
    },
  ];

  const visibleTabs = tabsConfig.filter(
    (tab) => !tab.roles || hasPermission(tab.roles, user?.role)
  );

  return (
    <div className="w-full px-6 py-10 flex flex-col">
      <h2 className="mb-5 font-semibold text-2xl">
        {translations.account_settings}
      </h2>
      <Tabs
        defaultValue={visibleTabs[0]?.value}
        className="flex gap-2 bg-white rounded-xl h-full w-full"
      >
        <TabsList className="flex flex-col items-start justify-start bg-white gap-1">
          {visibleTabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="p-0 pr-12 mb-4 text-[#5F5F5F] text-sm font-medium"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <Separator orientation="vertical" />
        {visibleTabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="w-full">
            {tab.component}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ProfileTabs;
