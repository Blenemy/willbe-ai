"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  useLeadScenarios,
  useSavedAccounts,
  useLeadsByAccountsAndScenarios,
  Lead,
} from "@/hooks/useEditScenarioData";
import { LeadScenariosTable } from "./LeadScenarioTable";
import { AccountsTable } from "./AccountsTable";
import { LeadsTable } from "./LeadsTable";

interface Props {
  onImport: (selectedIds: string[]) => Promise<void>;
}

export const EditScenarioTables = ({ onImport }: Props) => {
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
      <h3 className="text-lg font-medium">Include data</h3>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="scenarios">
            📝 Lead generation scenario
          </TabsTrigger>
          <TabsTrigger value="accounts">🗂 Accounts</TabsTrigger>
          <TabsTrigger value="leads">👥 Leads</TabsTrigger>
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
