import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import YourCompanyTab from "./tabs/YourCompanyTab";
import ProductsAndServicesTab from "./tabs/ProductsAndServicesTab";

const tabsConfig = [
  {
    value: "your-company",
    label: "Your company",
    component: <YourCompanyTab />,
  },
  {
    value: "products-and-services",
    label: "Product & services",
    component: <ProductsAndServicesTab />,
  },
];

const CompanyPage = () => {
  return (
    <div className="bg-gray-100 w-full px-6 py-10 flex flex-col">
      <h2 className="mb-5 font-semibold text-2xl">Company settings</h2>
      <Tabs
        defaultValue="your-company"
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
export default CompanyPage;
