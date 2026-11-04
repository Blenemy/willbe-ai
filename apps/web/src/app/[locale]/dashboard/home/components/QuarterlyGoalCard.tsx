"use client";

import { FormEvent, useEffect, useState } from "react";
import { Pencil, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuarterlyGoal, useUpdateQuarterlyGoal } from "@/hooks/useHomepage";
import { handleAxiosError } from "@/utils/handleAxiosError/handleAxiosError";

const share = (value: number, total: number) =>
  total > 0 ? Math.min(100, Math.max(0, (value / total) * 100)) : 0;

export default function QuarterlyGoalCard() {
  const { quarterlyGoal, isLoading, error } = useQuarterlyGoal();
  const updateGoal = useUpdateQuarterlyGoal();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    if (error) {
      handleAxiosError(error, "Failed to get the quarterly goal");
    }
  }, [error]);

  useEffect(() => {
    if (!quarterlyGoal) {
      return;
    }
    const timeout = setTimeout(() => setIsRevealed(true), 50);
    return () => clearTimeout(timeout);
  }, [quarterlyGoal]);

  const {
    goal = 0,
    won = 0,
    pipeline = 0,
    currency = "EUR",
    quarter = "",
  } = quarterlyGoal ?? {};

  const scale = Math.max(pipeline, goal, won);
  const progress = goal > 0 ? Math.round((won / goal) * 100) : 0;
  const goalPosition = Math.min(94, Math.max(6, share(goal, scale)));
  const quarterLabel = quarter.replace(/^(\d{4})-(Q\d)$/, "$2 $1");

  const format = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value);

  const openEditor = () => {
    setDraft(goal ? String(goal) : "");
    setIsEditing(true);
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const value = Number(draft);
    if (!Number.isInteger(value) || value < 0) {
      return;
    }
    updateGoal.mutate(value, { onSuccess: () => setIsEditing(false) });
  };

  return (
    <Card className="rounded-2xl h-full flex flex-col overflow-hidden">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="flex flex-col gap-2">
          <CardTitle>Quarterly Goal</CardTitle>
          <p className="text-sm text-muted-foreground">{quarterLabel}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={openEditor}
          aria-label="Edit quarterly goal"
        >
          <Pencil className="w-4 h-4" />
        </Button>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col justify-center bg-slate-50 px-6 py-4">
        {isLoading && <Skeleton className="h-11 w-full rounded-full" />}

        {!isLoading && scale === 0 && (
          <div className="flex flex-col items-center gap-2 text-center text-muted-foreground">
            <p className="text-sm">No goal set for this quarter yet.</p>
            <Button variant="outline" size="sm" onClick={openEditor}>
              Set a goal
            </Button>
          </div>
        )}

        {!isLoading && scale > 0 && (
          <div className="relative py-7">
            <span className="absolute right-0 top-0 text-xs text-muted-foreground">
              Pipeline
            </span>

            <div className="relative flex h-11 items-center justify-end rounded-full border border-slate-200 bg-white px-4">
              <div
                data-testid="quarterly-goal-progress"
                className="absolute inset-y-0 left-0 flex min-w-fit items-center overflow-hidden rounded-full bg-[#030A27] text-xs font-semibold text-white transition-[width] duration-1000 ease-out"
                style={{ width: isRevealed ? `${share(won, scale)}%` : "0%" }}
              >
                <span className="flex h-full items-center rounded-full bg-slate-500 px-3">
                  {progress}%
                </span>
                <span className="whitespace-nowrap px-3">{format(won)}</span>
              </div>
              <span className="relative text-sm font-semibold">
                {format(pipeline)}
              </span>
            </div>

            {goal > 0 && (
              <div
                className="pointer-events-none absolute inset-y-0 flex -translate-x-1/2 flex-col items-center"
                style={{ left: `${goalPosition}%` }}
              >
                <span className="flex items-center gap-1 whitespace-nowrap text-xs text-muted-foreground">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  Goal
                </span>
                <span className="w-px flex-1 bg-slate-400" />
                <span className="whitespace-nowrap text-xs font-semibold">
                  {format(goal)}
                </span>
              </div>
            )}
          </div>
        )}
      </CardContent>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-sm">
          <form onSubmit={submit} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Quarterly goal</DialogTitle>
              <DialogDescription>
                Revenue target the team is working towards this quarter.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <Label htmlFor="quarterly-goal">
                Goal for {quarterLabel} ({currency})
              </Label>
              <Input
                id="quarterly-goal"
                type="number"
                min={0}
                step={1}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                autoFocus
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateGoal.isPending || draft === ""}
              >
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
