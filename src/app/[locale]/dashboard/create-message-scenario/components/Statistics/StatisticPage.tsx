"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CadenceTimeframeTable } from "./tabs/CadenceTimeframeTable";
import { StatisticsMessagesTable } from "./tabs/StatisticsMessagesTable";
import { StatsCards } from "./StatsCards";

export const StatisticPage = () => {
  const [activeTab, setActiveTab] = useState("cadence");

  return (
    <div className="mt-6 space-y-4">
      <StatsCards />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="cadence">Cadence timeframe (3)</TabsTrigger>
          <TabsTrigger value="leads">Leads (200)</TabsTrigger>
          <TabsTrigger value="messages">Messages (400)</TabsTrigger>
        </TabsList>

        <TabsContent value="cadence">
          <CadenceTimeframeTable />
        </TabsContent>

        <TabsContent value="leads">
          <div className="border rounded-lg p-4 text-sm text-muted-foreground">
            Leads table coming soon...
          </div>
        </TabsContent>

        <TabsContent value="messages">
          <StatisticsMessagesTable />
        </TabsContent>
      </Tabs>
    </div>
  );
};
