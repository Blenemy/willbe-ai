"use client";

import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";

const data = [
  { name: "Account", actual: 12, projected: 0 },
  { name: "Lead", actual: 28, projected: 0 },
  { name: "Meetings", actual: 10, projected: 6 },
  { name: "Responses", actual: 4, projected: 10 },
  { name: "Out of office", actual: 20, projected: 0 },
  { name: "Bounced", actual: 19, projected: 0 },
];

const colors = [
  "#0f172a", // slate-900
  "#71717a", // zinc-500
  "#4ade80", // green-400
  "#facc15", // yellow-400
  "#f97316", // orange-500
  "#ef4444", // red-500
];

export default function ScenarioPerformanceChart() {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="flex items-start justify-between">
        <div>
          <CardTitle>Scenario performance</CardTitle>
          <p className="text-sm text-muted-foreground">In the last month</p>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <CalendarDays className="w-4 h-4" />
        </Button>
      </CardHeader>

      <CardContent className="p-4">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barCategoryGap={5}>
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                interval={0}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  fontSize: "0.875rem",
                  borderRadius: "0.5rem",
                  padding: "0.5rem",
                }}
                labelStyle={{ color: "hsl(var(--muted-foreground))" }}
              />
              <Bar
                dataKey="actual"
                stackId="a"
                radius={[4, 4, 0, 0]}
                activeBar={false}
              >
                {data.map((_, index) => (
                  <Cell
                    key={`actual-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Bar>
              <Bar
                dataKey="projected"
                stackId="a"
                radius={[0, 0, 0, 0]}
                activeBar={false}
              >
                {data.map((_, index) => (
                  <Cell
                    key={`projected-${index}`}
                    fill={colors[index % colors.length]}
                    fillOpacity={0.4}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
