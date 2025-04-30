"use client";

import { useState } from "react";
import { addDays, format, isToday, isWeekend, startOfToday } from "date-fns";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getMessageIcon } from "@/utils/getMessageIcon";
import { MessageEntry } from "@/hooks/useMessageCampaignEntries";
import { MessageEntryPopover } from "./MessageEntryPopover";

interface Props {
  entries: MessageEntry[];
  onAddStep: () => void;
  onEditStep: (entry: MessageEntry) => void;
  onDeleteStep: (entry: MessageEntry) => void;
  onSelectStep: (id: string) => void;
  selectedEntryId: string | null;
  scenarioTitle: string;
}

const getDayKey = (date: Date) => format(date, "yyyy-MM-dd");

export const ScenarioCalendar = ({
  entries,
  onAddStep,
  onEditStep,
  onDeleteStep,
  onSelectStep,
  selectedEntryId,
  scenarioTitle,
}: Props) => {
  const [startDate, setStartDate] = useState(startOfToday());

  const days = Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));
  const entriesByDay: Record<string, MessageEntry[]> = {};

  for (const entry of entries) {
    const key = format(new Date(entry.sendDate), "yyyy-MM-dd");
    if (!entriesByDay[key]) entriesByDay[key] = [];
    entriesByDay[key].push(entry);
  }

  const goToday = () => setStartDate(startOfToday());
  const goForward = () => setStartDate((prev) => addDays(prev, 7));
  const goBack = () => setStartDate((prev) => addDays(prev, -7));
  const canGoBack = (() => {
    const prevWeekStart = addDays(startDate, -7);
    const prevWeekEnd = addDays(startDate, -1);

    return entries.some((entry) => {
      const entryDate = new Date(entry.sendDate);
      return entryDate >= prevWeekStart && entryDate <= prevWeekEnd;
    });
  })();

  return (
    <div className="flex flex-col rounded-md bg-white">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{scenarioTitle}</h3>
        <div className="flex gap-2">
          <Button onClick={onAddStep} className="bg-[#084960]">
            + Add step
          </Button>
          <Button
            variant="outline"
            onClick={goToday}
            className="border-[#084960] text-[#084960]"
          >
            Today
          </Button>
          <Button variant="ghost" onClick={goBack} disabled={!canGoBack}>
            {"<"}
          </Button>
          <Button variant="ghost" onClick={goForward}>
            {">"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-8 text-sm text-center bg-[#F8F9FB] border-t border-l">
        <div className="font-medium py-2 border-r border-b bg-[#F8F9FB]">
          Type
        </div>
        {days.map((day) => (
          <div
            key={day.toISOString()}
            className={cn(
              "py-2 px-1 border-r border-b",
              isWeekend(day) && "bg-gray-100 text-gray-400",
              isToday(day) && "bg-blue-50 font-semibold"
            )}
          >
            <div>{format(day, "MMM dd")}</div>
            <div className="text-xs">{format(day, "EEE")}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-8 text-sm text-center border-l">
        <div className="py-3 px-2 flex items-center justify-start gap-2 border-r border-b bg-white">
          <span className="text-lg">{getMessageIcon("first_email", 20)}</span>{" "}
          Email
        </div>
        {days.map((day) => {
          const key = getDayKey(day);
          const emailTypes = ["first_email", "follow_up_email"];
          const emails =
            entriesByDay[key]?.filter((e) => emailTypes.includes(e.type)) ?? [];
          return (
            <div
              key={key}
              className="py-3 border-r border-b bg-white text-center relative group flex items-center justify-center gap-2"
            >
              {emails.map((entry) => (
                <MessageEntryPopover
                  key={entry.id}
                  entry={entry}
                  onEdit={onEditStep}
                  onDelete={onDeleteStep}
                  onSelect={() => onSelectStep(entry.id)} // ✅
                  isSelected={selectedEntryId === entry.id} // ✅
                />
              ))}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-8 text-sm text-center border-l">
        <div className="py-3 px-2 flex items-center justify-start gap-2 border-r border-b bg-white">
          <span className="text-lg">{getMessageIcon("linkedin_icon", 20)}</span>{" "}
          LinkedIn
        </div>
        {days.map((day) => {
          const key = getDayKey(day);
          const linkedinTypes = [
            "linkedin_connection",
            "linkedin_message",
            "linkedin_follow_up",
          ];
          const linkedins =
            entriesByDay[key]?.filter((e) => linkedinTypes.includes(e.type)) ??
            [];
          return (
            <div
              key={key}
              className="py-3 border-r border-b bg-white text-center relative group flex items-center justify-center gap-2"
            >
              {linkedins.map((entry) => (
                <MessageEntryPopover
                  key={entry.id}
                  entry={entry}
                  onEdit={onEditStep}
                  onDelete={onDeleteStep}
                  onSelect={() => onSelectStep(entry.id)} // ✅
                  isSelected={selectedEntryId === entry.id} // ✅
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};
