import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import YourCompanyTab from "./tabs/YourCompanyTab";
import ProductsAndServicesTab from "./tabs/ProductsAndServicesTab";
import { getTranslations } from "next-intl/server";

const CompanyPage = async () => {
  const t = await getTranslations("Company");

  const tabsConfig = [
    {
      value: "your-company",
      label: t("your_company"),
      component: <YourCompanyTab />,
    },
    {
      value: "products-and-services",
      label: t("products_and_services"),
      component: <ProductsAndServicesTab />,
    },
  ];

  return (
    <div className="w-full px-6 py-10 flex flex-col">
      <h2 className="mb-5 font-semibold text-2xl">{t("company_settings")}</h2>
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
