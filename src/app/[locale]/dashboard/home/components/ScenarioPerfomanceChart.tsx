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
  { name: "Account", count: 12 },
  { name: "Lead", count: 28 },
  { name: "Meetings", count: 16 },
  { name: "Responses", count: 14 },
  { name: "Out of office", count: 20 },
  { name: "Bounced", count: 19 },
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
    <Card>
      <CardHeader className="flex items-start justify-between">
        <div>
          <CardTitle>Scenario performance</CardTitle>
          <p className="text-sm text-muted-foreground">In the last month</p>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <CalendarDays className="w-4 h-4" />
        </Button>
      </CardHeader>

      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barCategoryGap={25}>
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  fontSize: "0.875rem",
                }}
                labelStyle={{ color: "hsl(var(--muted-foreground))" }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
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
