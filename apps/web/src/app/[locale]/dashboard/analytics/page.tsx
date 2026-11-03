"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMessageScenarios } from "@/hooks/useMessageScenarios";
import {
  useMeetingsResponseRate,
  useScenarioPerformance,
} from "@/hooks/useHomepage";

const DAYS_INTERVAL = 30;

const STATUS_LABELS: Record<string, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  done: "Done",
};

function KpiCard({
  label,
  value,
  isLoading,
}: {
  label: string;
  value: string | number;
  isLoading: boolean;
}) {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-2">
        <p className="text-sm text-muted-foreground">{label}</p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-20" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
      </CardContent>
    </Card>
  );
}

export default function AnalyticsPage() {
  const { data: scenarios = [], isLoading: scenariosLoading } =
    useMessageScenarios();
  const rates = useMeetingsResponseRate({
    enableFetch: true,
    daysInterval: DAYS_INTERVAL,
  });
  const { performance, isLoading: performanceLoading } =
    useScenarioPerformance({ enableFetch: true, daysInterval: DAYS_INTERVAL });

  const launched = scenarios.filter((scenario) => scenario.messagesSent > 0);
  const totalSent = scenarios.reduce(
    (sum, scenario) => sum + (scenario.messagesSent ?? 0),
    0
  );
  const chartData = launched.map((scenario) => ({
    name: scenario.name,
    "Response rate": scenario.responseRate,
    "Meeting rate": scenario.meetingRate,
    "Bounce rate": scenario.bounceRate,
  }));

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Outreach results across all campaigns, last {DAYS_INTERVAL} days.
        </p>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Messages sent"
          value={totalSent}
          isLoading={scenariosLoading}
        />
        <KpiCard
          label="Response rate"
          value={`${rates.responseRate ?? 0}%`}
          isLoading={rates.isLoading}
        />
        <KpiCard
          label="Meeting rate"
          value={`${rates.meetingRate ?? 0}%`}
          isLoading={rates.isLoading}
        />
        <KpiCard
          label="Meetings booked"
          value={performance?.meetings ?? 0}
          isLoading={performanceLoading}
        />
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Campaign comparison</CardTitle>
        </CardHeader>
        <CardContent className="h-[360px]">
          {scenariosLoading ? (
            <Skeleton className="w-full h-full rounded-lg" />
          ) : chartData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No campaigns have sent messages yet.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis unit="%" tickLine={false} axisLine={false} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
                <Bar dataKey="Response rate" fill="#0f172a" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Meeting rate" fill="#4ade80" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Bounce rate" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Leads</TableHead>
                <TableHead>Sent</TableHead>
                <TableHead>Response rate</TableHead>
                <TableHead>Meeting rate</TableHead>
                <TableHead>Bounce rate</TableHead>
                <TableHead>Out of office</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scenarios.map((scenario) => (
                <TableRow key={scenario.id}>
                  <TableCell className="font-medium">{scenario.name}</TableCell>
                  <TableCell>
                    {STATUS_LABELS[scenario.status] ?? scenario.status}
                  </TableCell>
                  <TableCell>{scenario.leadsInCadence}</TableCell>
                  <TableCell>{scenario.messagesSent}</TableCell>
                  <TableCell>{scenario.responseRate}%</TableCell>
                  <TableCell>{scenario.meetingRate}%</TableCell>
                  <TableCell>{scenario.bounceRate}%</TableCell>
                  <TableCell>{scenario.outOfOfficeRate}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
