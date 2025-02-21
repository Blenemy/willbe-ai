import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileTab from "./tabs/ProfileTab";
import { Separator } from "@/components/ui/separator";
import SecurityTab from "./tabs/SecurityTab";
import BillingTab from "./tabs/BillingTab";
import ConnectionsTab from "./tabs/ConnectionsTab";
import SignatureTab from "./tabs/SignatureTab";

const ProfilePage = () => {
  return (
    <div className="bg-gray-100 w-full px-6 py-10 flex flex-col">
      <h2 className="mb-5 font-semibold text-2xl">Account Settings</h2>
      <Tabs
        defaultValue="profile"
        className="flex gap-2 bg-white p-4 rounded-xl h-full w-full"
      >
        <TabsList className="flex flex-col items-start justify-start bg-white gap-1">
          <TabsTrigger value="profile">My profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="connections">Connections</TabsTrigger>
          <TabsTrigger value="e-signature">Email signature</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="data export">Data export</TabsTrigger>
        </TabsList>
        <Separator orientation="vertical" />
        <TabsContent value="profile" className="w-full">
          <ProfileTab />
        </TabsContent>
        <TabsContent value="security" className="w-full">
          <SecurityTab />
        </TabsContent>
        <TabsContent value="billing" className="w-full">
          <BillingTab />
        </TabsContent>
        <TabsContent value="connections" className="w-full">
          <ConnectionsTab />
        </TabsContent>
        <TabsContent value="e-signature" className="w-full">
          <SignatureTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default ProfilePage;
