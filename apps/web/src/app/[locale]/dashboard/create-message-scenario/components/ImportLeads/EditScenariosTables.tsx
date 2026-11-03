"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  useLeadScenarios,
  useSavedAccounts,
  useLeadsByAccountsAndScenarios,
  Lead,
} from "@/hooks/useEditScenarioData";
import { LeadScenariosTable } from "./tabs/LeadScenarioTable";
import { AccountsTable } from "./tabs/AccountsTable";
import { LeadsTable } from "./tabs/LeadsTable";

interface Props {
  onImport: (selectedIds: string[]) => Promise<void>;
}

export const EditScenarioTables = ({ onImport }: Props) => {
  const t = useTranslations("messageScenarioData");
  const [activeTab, setActiveTab] = useState("scenarios");
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([]);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);

  const { data: scenarios = [] } = useLeadScenarios();
  const { data: accounts = [] } = useSavedAccounts();
  const { mutateAsync: fetchLeads } = useLeadsByAccountsAndScenarios();

  useEffect(() => {
    const fetch = async () => {
      const leads = await fetchLeads({
        accountsIds: selectedAccounts,
        leadScenariosIds: selectedScenarios,
      });
      setLeads(leads);
    };

    fetch();
  }, [fetchLeads, selectedAccounts, selectedScenarios]);

  return (
    <div className="space-y-4 mt-6">
      <h3 className="text-lg font-medium">{t("includeData")}</h3>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="scenarios">{t("tabs.scenarios")}</TabsTrigger>
          <TabsTrigger value="accounts">{t("tabs.accounts")}</TabsTrigger>
          <TabsTrigger value="leads">{t("tabs.leads")}</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts">
          <AccountsTable
            data={accounts}
            selected={selectedAccounts}
            setSelected={setSelectedAccounts}
          />
        </TabsContent>

        <TabsContent value="scenarios">
          <LeadScenariosTable
            data={scenarios}
            selected={selectedScenarios}
            setSelected={setSelectedScenarios}
          />
        </TabsContent>

        <TabsContent value="leads">
          <LeadsTable
            data={leads}
            selected={selectedLeads}
            setSelected={setSelectedLeads}
            onImport={onImport}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
