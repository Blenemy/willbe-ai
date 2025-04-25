"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CadenceTimeframeTable } from "./tabs/CadenceTimeframeTable";
import { StatisticsMessagesTable } from "./tabs/StatisticsMessagesTable";
import { StatsCards } from "./StatsCards";
import { LeadsInCadenceTable } from "./tabs/LeadsInCadenceTable";
import { ExportStatisticsCsvButtons } from "./ExportCsvButtons";
import { useParams } from "next/navigation";
import { Scenario } from "@/hooks/useMessageScenarios";

interface StatisticsPageProps {
  scenario: Scenario | undefined;
}

export const StatisticPage = ({ scenario }: StatisticsPageProps) => {
  const [activeTab, setActiveTab] = useState("cadence");
  const params = useParams();
  const scenarioId = params.id as string;

  return (
    <div className="mt-6 space-y-4">
      <div className="flex justify-between items-center">
        <p>{scenario?.name}</p>
        <ExportStatisticsCsvButtons scenarioId={scenarioId} />
      </div>

      <StatsCards />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="cadence">Cadence timeframe</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>

        <TabsContent value="cadence">
          <CadenceTimeframeTable />
        </TabsContent>

        <TabsContent value="leads">
          <LeadsInCadenceTable />
        </TabsContent>

        <TabsContent value="messages">
          <StatisticsMessagesTable />
        </TabsContent>
      </Tabs>
    </div>
  );
};
