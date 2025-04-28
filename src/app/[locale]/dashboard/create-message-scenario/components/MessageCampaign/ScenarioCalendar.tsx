"use client";

import { useState } from "react";
import { addDays, format, isToday, isWeekend, startOfToday } from "date-fns";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getMessageIcon } from "@/utils/getMessageIcon";

type MessageEntry = {
  id: string;
  type: "email" | "linkedin";
  sendDate: string;
};

const MOCK_ENTRIES: MessageEntry[] = [
  { id: "1", type: "email", sendDate: "2025-04-22" },
  { id: "2", type: "linkedin", sendDate: "2025-04-23" },
  { id: "3", type: "email", sendDate: "2025-04-24" },
  { id: "4", type: "linkedin", sendDate: "2025-04-25" },
  { id: "5", type: "email", sendDate: "2025-04-28" },
  { id: "6", type: "email", sendDate: "2025-04-28" },
  { id: "7", type: "linkedin", sendDate: "2025-04-28" },
];

const getDayKey = (date: Date) => format(date, "yyyy-MM-dd");

export const ScenarioCalendar = () => {
  const [startDate, setStartDate] = useState(startOfToday());

  const days = Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));
  const entriesByDay: Record<string, MessageEntry[]> = {};

  for (const entry of MOCK_ENTRIES) {
    const key = entry.sendDate;
    if (!entriesByDay[key]) entriesByDay[key] = [];
    entriesByDay[key].push(entry);
  }

  const goToday = () => setStartDate(startOfToday());
  const goForward = () => setStartDate((prev) => addDays(prev, 1));

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Scenario Title</h3>
        <div className="flex gap-2">
          <Button variant="outline" onClick={goToday}>
            Today
          </Button>
          <Button onClick={goForward}>{">"}</Button>
        </div>
      </div>
      <div className="flex flex-col">
        {/* Header */}

        {/* Calendar Header */}
        <div className="grid grid-cols-8 text-sm text-center bg-[#F8F9FB] border-t border-l">
          <div className="font-medium border-r border-b bg-[#F8F9FB] flex items-center justify-center">
            Type
          </div>
          {days.map((day) => (
            <div
              key={day.toISOString()}
              className={cn(
                "py-2 border-r border-b",
                isWeekend(day) && "bg-gray-100 text-gray-400",
                isToday(day) && "bg-blue-50 font-semibold"
              )}
            >
              <div>{format(day, "MMM dd")}</div>
              <div className="text-xs">{format(day, "EEE")}</div>
            </div>
          ))}
        </div>

        {/* Email Row */}
        <div className="grid grid-cols-8 text-sm text-center border-l">
          <div className="py-3 px-2 flex items-center justify-start gap-2 border-r border-b bg-white">
            <span className="text-lg">📧</span> Email
          </div>
          {days.map((day) => {
            const key = getDayKey(day);
            const emails =
              entriesByDay[key]?.filter((e) => e.type === "email") ?? [];
            return (
              <div
                key={key}
                className="py-3 border-r border-b bg-white text-center relative group"
              >
                {emails.map((entry, i) => (
                  <div
                    key={i}
                    className="cursor-pointer flex items-center gap-1"
                  >
                    {getMessageIcon(entry.type)}
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {/* LinkedIn Row */}
        <div className="grid grid-cols-8 text-sm text-center border-l">
          <div className="py-3 px-2 flex items-center justify-start gap-2 border-r border-b bg-white">
            <span className="text-lg">🔗</span> LinkedIn
          </div>
          {days.map((day) => {
            const key = getDayKey(day);
            const linkedins =
              entriesByDay[key]?.filter((e) => e.type === "linkedin") ?? [];
            return (
              <div
                key={key}
                className="py-3 border-r border-b bg-white text-center relative group"
              >
                {linkedins.map((entry, i) => (
                  <div key={i} className="cursor-pointer flex">
                    {getMessageIcon(entry.type)}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
