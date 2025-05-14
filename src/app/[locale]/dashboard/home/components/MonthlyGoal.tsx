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

  const goalLabelPosition = showPipeline
    ? Math.min(100, (goal / total) * 100)
    : 100;

  return (
    <Card className="w-full">
      <CardHeader className="flex justify-between items-start">
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
        {/* Верхняя метка Goal и Pipeline */}
        <div className="relative h-5 mb-1">
          {/* Goal label */}
          <div
            className="absolute -translate-x-1/2 text-sm text-muted-foreground text-nowrap"
            style={{ left: `${goalLabelPosition}%` }}
          >
            ⭐ Goal
          </div>

          {/* Pipeline label */}
          {showPipeline && (
            <div className="absolute right-0 text-sm text-muted-foreground pr-1">
              Pipeline
            </div>
          )}
        </div>

        {/* Прогрессбар */}
        <div className="relative h-10 bg-muted rounded-full overflow-hidden border border-border">
          {/* Achieved */}
          <div
            className="absolute top-0 left-0 h-full bg-primary rounded-l-full flex items-center pl-3 text-white text-sm font-semibold z-10"
            style={{ width: `${achievedPercent}%` }}
          >
            <span>{achievedPercent}%</span>
            <span className="ml-2">${achieved.toLocaleString()}</span>
          </div>

          {/* Pipeline overlay */}
          {showPipeline && (
            <div
              className="absolute top-0 left-0 h-full bg-muted-foreground/20 z-0"
              style={{ width: `${totalPercent}%` }}
            />
          )}

          {/* Pipeline value on right */}
          {showPipeline && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium z-10">
              ${pipeline.toLocaleString()}
            </div>
          )}

          {/* Goal marker line */}
          <div
            className="absolute top-0 bottom-0 w-[1px] bg-border z-20"
            style={{ left: `${goalLabelPosition}%` }}
          />
        </div>

        {/* Goal value below bar */}
        <div className="relative mt-2 h-5">
          <div
            className="absolute -translate-x-1/2 text-xs text-muted-foreground font-medium"
            style={{ left: `${goalLabelPosition}%` }}
          >
            ${goal.toLocaleString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
