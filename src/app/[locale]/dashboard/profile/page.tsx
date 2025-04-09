import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import ProfileTab from "./tabs/ProfileTab";
import SecurityTab from "./tabs/SecurityTab";
import BillingTab from "./tabs/BillingTab";
import ConnectionsTab from "./tabs/ConnectionsTab";
import SignatureTab from "./tabs/SignatureTab";
import { getProfileTranslations } from "@/hooks/translations/getProfileTranslations";

const ProfilePage = async () => {
  const translations = await getProfileTranslations();

  const tabsConfig = [
    {
      value: "profile",
      label: translations.tab_profile,
      component: <ProfileTab />,
    },
    {
      value: "security",
      label: translations.tab_security,
      component: <SecurityTab />,
    },
    {
      value: "billing",
      label: translations.tab_billing,
      component: <BillingTab />,
    },
    {
      value: "connections",
      label: translations.tab_connections,
      component: <ConnectionsTab />,
    },
    {
      value: "e-signature",
      label: translations.tab_signature,
      component: <SignatureTab />,
    },
    {
      value: "notifications",
      label: "Notifications",
      component: <div>Notifications Content</div>,
    },
    {
      value: "data export",
      label: "Data export",
      component: <div>Data Export Content</div>,
    },
  ];

  return (
    <div className="bg-gray-100 w-full px-6 py-10 flex flex-col">
      <h2 className="mb-5 font-semibold text-2xl">
        {translations.account_settings}
      </h2>
      <Tabs
        defaultValue="profile"
        className="flex gap-2 bg-white p-4 rounded-xl h-full w-full"
      >
        <TabsList className="flex flex-col items-start justify-start bg-white gap-1">
          {tabsConfig.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <Separator orientation="vertical" />
        {tabsConfig.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="w-full">
            {tab.component}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ProfilePage;
