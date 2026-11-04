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

  const rates = [
    { label: "Meeting rate", value: meetingRate, icon: Users },
    { label: "Response rate", value: responseRate, icon: Reply },
  ];

  return (
    <Card className="rounded-2xl h-full flex flex-col overflow-hidden">
      <CardHeader className="flex justify-between flex-row space-y-0 px-6 py-4">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-lg">Meetings & responses</CardTitle>
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

      <CardContent className="grid flex-1 grid-cols-2 divide-x divide-slate-200 bg-slate-50 p-0">
        {rates.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="flex flex-col items-center justify-center gap-1 py-4"
          >
            {isLoading ? (
              <Skeleton className="h-9 w-24 rounded-md" />
            ) : (
              <div className="flex items-center gap-2 text-3xl font-semibold text-[#030A27]">
                <Icon className="h-7 w-7" />
                <span>{value}%</span>
              </div>
            )}
            <span className="text-sm text-muted-foreground">{label}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
