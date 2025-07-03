"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CalendarDays, Users, Reply } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMeetingsResponseRate } from "@/hooks/useHomepage";
import { useToggleDaysInterval } from "@/hooks/useToggleDaysInterval";
import { handleAxiosError } from "@/utils/handleAxiosError/handleAxiosError";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function MeetingsResponsesCard() {
  const { daysInterval, toggleInterval, subtitleText } =
    useToggleDaysInterval();

  const { responseRate, meetingRate, error, isLoading } =
    useMeetingsResponseRate({
      enableFetch: true,
      daysInterval,
    });

  useEffect(() => {
    if (error) {
      handleAxiosError(error, "Failed to get the meeting response rate");
    }
  }, [error]);

  return (
    <Card className="rounded-2xl h-full">
      <CardHeader className="flex justify-between flex-row">
        <div className="flex flex-col gap-2">
          <CardTitle>Meetings & responses</CardTitle>
          <p className="text-sm text-muted-foreground">{subtitleText}</p>
        </div>
        <div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={toggleInterval}
          >
            <CalendarDays className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="grid grid-cols-2 gap-4 text-center">
        <div>
          <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
            <Users className="w-4 h-4" />
            Meeting rate
          </div>
          {isLoading ? (
            <Skeleton className="w-16 h-6 mx-auto rounded-md" />
          ) : (
            <div className="text-2xl font-bold">{meetingRate}%</div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
            <Reply className="w-4 h-4" />
            Response rate
          </div>
          {isLoading ? (
            <Skeleton className="w-16 h-6 mx-auto rounded-md" />
          ) : (
            <div className="text-2xl font-bold">{responseRate}%</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
