"use client";

import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  YAxis,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";
import { useToggleDaysInterval } from "@/hooks/useToggleDaysInterval";
import { useScenarioPerformance } from "@/hooks/useHomepage";
import { useEffect } from "react";
import { handleAxiosError } from "@/utils/handleAxiosError/handleAxiosError";
import { colors } from "@/constants/colors";
import { Skeleton } from "@/components/ui/skeleton";

const categories = [
  { key: "account", label: "Account" },
  { key: "lead", label: "Lead" },
  { key: "meetings", label: "Meetings" },
  { key: "responses", label: "Responses" },
  { key: "outOfOffice", label: "Out of office" },
  { key: "bounced", label: "Bounced" },
];

export default function ScenarioPerformanceChart() {
  const { daysInterval, toggleInterval, subtitleText } =
    useToggleDaysInterval();

  const { performance, error, isLoading } = useScenarioPerformance({
    enableFetch: true,
    daysInterval,
  });

  const chartData = categories.map(({ key, label }) => {
    const actual = performance?.[key as keyof typeof performance] ?? 0;
    return {
      name: label,
      value: actual,
      visualValue: actual === 0 ? 0.2 : actual,
    };
  });

  const isEmptyData = chartData.every((d) => d.value === 0);

  useEffect(() => {
    if (error) {
      handleAxiosError(error, "Failed to get the scenario performance");
    }
  }, [error]);

  return (
    <Card className="border overflow-hidden bg-white h-full flex flex-col rounded-2xl">
      <CardHeader className="flex items-start justify-between flex-row">
        <div className="flex flex-col gap-2">
          <CardTitle>Scenario performance</CardTitle>
          <p className="text-sm text-muted-foreground">{subtitleText}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={toggleInterval}
        >
          <CalendarDays className="w-4 h-4" />
        </Button>
      </CardHeader>

      <CardContent className="p-0 flex-grow">
        {isLoading && (
          <div className="h-[350px]">
            <Skeleton className="w-full h-full rounded-lg" />
          </div>
        )}

        {!isLoading && isEmptyData && (
          <div className="h-[350px] flex flex-col items-center justify-center text-center py-12 text-muted-foreground">
            <CalendarDays className="w-10 h-10 mb-4" />
            <p className="text-lg font-medium mb-1">No data found</p>
            <p className="text-sm max-w-sm">
              Try adjusting the date range or come back later when there is data
              to display.
            </p>
          </div>
        )}

        {!isLoading && !isEmptyData && (
          <div className="h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barCategoryGap={5}>
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                />
                <YAxis domain={[0, 50]} hide />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  formatter={(_, __, props) => {
                    const originalValue = props?.payload?.value ?? 0;
                    return [originalValue, "value"];
                  }}
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
                  dataKey="visualValue"
                  stackId="a"
                  radius={[4, 4, 0, 0]}
                  isAnimationActive={false}
                  activeBar={false}
                >
                  {chartData.map((_, index) => (
                    <Cell
                      key={`actual-${index}`}
                      fill={colors[index % colors.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
