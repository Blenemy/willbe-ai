import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import YourCompanyTab from "./tabs/YourCompanyTab";
import ProductsAndServicesTab from "./tabs/ProductsAndServicesTab";

const ProfilePage = () => {
  return (
    <div className="bg-gray-100 w-full px-6 py-10 flex flex-col">
      <h2 className="mb-5 font-semibold text-2xl">Company settings</h2>
      <Tabs
        defaultValue="profile"
        className="flex gap-2 bg-white p-4 rounded-xl h-full w-full"
      >
        <TabsList className="flex flex-col items-start justify-start bg-white gap-1">
          <TabsTrigger value="your-company">Your company</TabsTrigger>
          <TabsTrigger value="products-and-services">
            Product & services
          </TabsTrigger>
        </TabsList>
        <Separator orientation="vertical" />
        <TabsContent value="your-company" className="w-full">
          <YourCompanyTab />
        </TabsContent>
        <TabsContent value="products-and-services" className="w-full">
          <ProductsAndServicesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default ProfilePage;
