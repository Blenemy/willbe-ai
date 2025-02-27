import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import ProfileTab from "./tabs/ProfileTab";
import SecurityTab from "./tabs/SecurityTab";
import BillingTab from "./tabs/BillingTab";
import ConnectionsTab from "./tabs/ConnectionsTab";
import SignatureTab from "./tabs/SignatureTab";

const tabsConfig = [
  { value: "profile", label: "My profile", component: <ProfileTab /> },
  { value: "security", label: "Security", component: <SecurityTab /> },
  { value: "billing", label: "Billing", component: <BillingTab /> },
  { value: "connections", label: "Connections", component: <ConnectionsTab /> },
  {
    value: "e-signature",
    label: "Email signature",
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

const ProfilePage = () => {
  return (
    <div className="bg-gray-100 w-full px-6 py-10 flex flex-col">
      <h2 className="mb-5 font-semibold text-2xl">Account Settings</h2>
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
