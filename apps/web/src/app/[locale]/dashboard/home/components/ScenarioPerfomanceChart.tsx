"use client";

import {
  BarChart,
  Bar,
  CartesianGrid,
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;

  const isMeetings = data.name === "Meetings";
  const isResponses = data.name === "Responses";

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md p-3 text-sm space-y-1">
      <div className="font-medium text-muted-foreground">{data.name}</div>

      {!isMeetings && !isResponses && <div>Total: {data.value}</div>}

      {isMeetings && (
        <>
          <div>Email: {data.meetingsEmail}</div>
          <div>LinkedIn: {data.meetingsLinkedin}</div>
        </>
      )}
      {isResponses && (
        <>
          <div>Email: {data.responsesEmail}</div>
          <div>LinkedIn: {data.responsesLinkedin}</div>
        </>
      )}
    </div>
  );
};

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
      meetingsEmail: performance?.meetingsEmail ?? 0,
      meetingsLinkedin: performance?.meetingsLinkedin ?? 0,
      responsesEmail: performance?.responsesEmail ?? 0,
      responsesLinkedin: performance?.responsesLinkedin ?? 0,
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
      <CardHeader className="flex items-start justify-between flex-row space-y-0 px-6 py-4">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-lg">Scenario performance</CardTitle>
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

      <CardContent className="p-0 flex-1 min-h-0 flex flex-col">
        {isLoading && (
          <div className="flex-1 min-h-[240px] px-6 pb-6">
            <Skeleton className="w-full h-full rounded-lg" />
          </div>
        )}

        {!isLoading && isEmptyData && (
          <div className="flex-1 min-h-[240px] flex flex-col items-center justify-center text-center py-12 text-muted-foreground">
            <CalendarDays className="w-10 h-10 mb-4" />
            <p className="text-lg font-medium mb-1">No data found</p>
            <p className="text-sm max-w-sm">
              Try adjusting the date range or come back later when there is data
              to display.
            </p>
          </div>
        )}

        {!isLoading && !isEmptyData && (
          <div className="flex-1 min-h-[240px] px-4 pb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                barCategoryGap="22%"
                margin={{ top: 8, right: 8, bottom: 0, left: 8 }}
              >
                <CartesianGrid vertical={false} stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                  tickMargin={8}
                  tick={{ fontSize: 12, fill: "#64748b" }}
                />
                <YAxis
                  domain={[
                    0,
                    (dataMax: number) => Math.max(10, Math.ceil(dataMax * 1.1)),
                  ]}
                  hide
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "transparent" }}
                />
                <Bar
                  dataKey="visualValue"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={64}
                  animationBegin={150}
                  animationDuration={900}
                  animationEasing="ease-out"
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
