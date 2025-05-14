"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MonthlyGoalProps {
  goal: number;
  achieved: number;
  pipeline: number;
  isAdmin: boolean;
}

export default function MonthlyGoal({
  goal,
  achieved,
  pipeline,
  isAdmin = true,
}: MonthlyGoalProps) {
  const achievedPercent = Math.min(100, Math.round((achieved / goal) * 100));
  const pipelinePercent =
    pipeline > 0 ? Math.round((pipeline / goal) * 100) : 0;
  const total = achieved + pipeline;
  const totalPercent = Math.min(100, achievedPercent + pipelinePercent);
  const showPipeline = pipeline > 0;

  // Правильная позиция Goal label
  const goalLabelPosition = showPipeline
    ? Math.min(100, (goal / total) * 100)
    : 100;

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row justify-between items-start">
        <CardTitle>Monthly Goal</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => alert("Open edit modal")}
        >
          <Pencil className="w-4 h-4" />
        </Button>
      </CardHeader>

      <CardContent>
        <div className="flex items-center gap-4 mb-2">
          <div
            className={cn(
              "text-sm px-2 py-1 rounded-full text-white font-medium",
              achievedPercent >= 100 ? "bg-green-600" : "bg-primary"
            )}
          >
            {achievedPercent}%
          </div>
          <span className="text-lg font-semibold">
            ${achieved.toLocaleString()}
          </span>
        </div>

        {/* Прогрессбар */}
        <div className="relative h-3 rounded-md bg-muted overflow-hidden mb-2">
          {/* Achieved */}
          <div
            className="absolute left-0 top-0 h-full bg-primary"
            style={{ width: `${achievedPercent}%` }}
          />

          {/* Pipeline (если есть) */}
          {showPipeline && (
            <div
              className="absolute left-0 top-0 h-full bg-muted-foreground/30"
              style={{ width: `${totalPercent}%` }}
            />
          )}

          {/* Goal marker */}
          <div
            className="absolute top-0 bottom-0 w-[1px] bg-border"
            style={{ left: `${goalLabelPosition}%` }}
          />
        </div>

        {/* Goal label (⭐ Goal) */}
        <div className="relative mt-1 h-5">
          <div
            className="absolute -translate-x-1/2 text-xs text-muted-foreground text-center"
            style={{ left: `${goalLabelPosition}%` }}
          >
            <span>⭐ ${goal.toLocaleString()} Goal</span>
          </div>
        </div>

        {/* Нижняя подпись pipeline, если есть */}
        {showPipeline && (
          <div className="text-xs text-muted-foreground text-right mt-1">
            ${pipeline.toLocaleString()} Pipeline
          </div>
        )}
      </CardContent>
    </Card>
  );
}
