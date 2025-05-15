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
  const hideGoalLine = achieved >= goal && pipeline === 0;

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
        {/* Legend above pipiline + goal */}
        <div className="relative h-6 mb-2">
          <div
            className="absolute -translate-x-1/2 text-sm  text-foreground text-nowrap"
            style={{ left: `${goalLabelPosition}%` }}
          >
            ⭐ Goal
          </div>
          {showPipeline && (
            <div className="absolute right-0 text-sm text-muted-foreground pr-1 font-medium">
              Pipeline
            </div>
          )}
        </div>

        <div className="relative">
          {/*Goal line */}
          {!hideGoalLine && (
            <div
              className={`absolute z-30 w-[2px] bg-slate-400`}
              style={{
                left: `${goalLabelPosition}%`,
                top: "-10px",
                height: "70px",
              }}
            />
          )}

          <div className="relative h-[52px] w-full rounded-full overflow-hidden border border-border">
            {/* Pipeline */}
            <div
              className="absolute top-0 left-0 h-full z-0"
              style={{ width: `${achievedPercent + pipelinePercent}%` }}
            />

            {/* Achieved */}
            <div
              className="absolute top-0 left-0 h-full z-10 flex justify-between items-center text-white text-sm font-semibold p-1"
              style={{
                width: `${achievedPercent}%`,
                minWidth: "5.5rem",
                backgroundColor: "#0B0E1B",
                borderTopLeftRadius: "9999px",
                borderBottomLeftRadius: "9999px",
                borderTopRightRadius: "9999px",
                borderBottomRightRadius: "9999px",
              }}
            >
              <div className="bg-[#8A8E9E] rounded-full text-white text-xs flex items-center justify-center w-32 h-full">
                {Math.min(100, Math.round((achieved / goal) * 100))}%
              </div>
              <span className="ml-2 whitespace-nowrap">
                ${achieved.toLocaleString()}
              </span>
            </div>

            {/* Pipeline text */}
            {showPipeline && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium z-20">
                ${pipeline.toLocaleString()}
              </div>
            )}
          </div>
        </div>

        {/* Legend below */}
        <div className="relative mt-3 h-5">
          <div
            className="absolute -translate-x-1/2 text-sm text-foreground font-semibold"
            style={{ left: `${goalLabelPosition}%` }}
          >
            ${goal.toLocaleString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
