"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

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
}: MonthlyGoalProps) {
  const achievedPercent =
    pipeline === 0
      ? Math.min(100, (achieved / goal) * 100)
      : Math.min(100, (achieved / pipeline) * 100);

  const pipelinePercent =
    pipeline === 0 ? 0 : Math.max(0, 100 - achievedPercent);
  const goalLabelPosition =
    pipeline === 0 ? 100 : Math.min(100, (goal / pipeline) * 100);

  const showPipeline = pipeline > 0;

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
          <div
            className="absolute -translate-x-1/2 text-sm text-muted-foreground text-nowrap"
            style={{ left: `${goalLabelPosition}%` }}
          >
            ⭐ Goal
          </div>
          {showPipeline && (
            <div className="absolute right-0 text-sm text-muted-foreground pr-1">
              Pipeline
            </div>
          )}
        </div>

        {/* Прогрессбар на 100% ширины */}
        <div className="relative h-10 w-full bg-muted rounded-full overflow-hidden border border-border">
          {/* Pipeline слой (всегда под achieved) */}
          <div
            className="absolute top-0 left-0 h-full bg-muted-foreground/30 z-0"
            style={{ width: `${achievedPercent + pipelinePercent}%` }}
          />

          {/* Achieved */}
          <div
            className="absolute top-0 left-0 h-full bg-primary z-10 flex items-center pl-3 pr-3 text-white text-sm font-semibold"
            style={{
              width: `${achievedPercent}%`,
              borderRadius: "9999px",
            }}
          >
            <div className="bg-[#8A8E9E] rounded-full w-16 text-center py-1 text-white">
              {Math.min(100, Math.round((achieved / goal) * 100))}%
            </div>
            <span className="ml-2">${achieved.toLocaleString()}</span>
          </div>

          {/* Pipeline текст */}
          {showPipeline && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium z-20">
              ${pipeline.toLocaleString()}
            </div>
          )}

          {/* Целевая черта */}
          <div
            className="absolute top-0 bottom-0 w-[1px] bg-border z-30"
            style={{ left: `${goalLabelPosition}%` }}
          />
        </div>

        {/* Подпись цели снизу */}
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
