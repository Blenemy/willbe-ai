"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Pencil, Trash2 } from "lucide-react";
import { MessageEntry } from "@/hooks/useMessageCampaignEntries";
import { getMessageIcon } from "@/utils/getMessageIcon";
import { cn } from "@/lib/utils";

interface Props {
  entry: MessageEntry;
  onEdit: (entry: MessageEntry) => void;
  onDelete: (entry: MessageEntry) => void;
  onSelect: (id: string) => void;
  isSelected: boolean;
}

export const MessageEntryPopover = ({
  entry,
  onEdit,
  onDelete,
  onSelect,
  isSelected,
}: Props) => {
  return (
    <div data-entry-popover>
      <Popover>
        <PopoverTrigger asChild>
          <div
            onClick={(e) => {
              e.stopPropagation();
              onSelect(entry.id);
            }}
            className={cn(
              "cursor-pointer p-1 rounded hover:bg-gray-100",
              isSelected && "border border-blue-500"
            )}
          >
            {getMessageIcon(entry.type, 20)}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-32 p-2 space-y-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(entry);
            }}
            className="flex items-center gap-2 w-full text-left hover:bg-gray-100 px-2 py-1 rounded text-sm"
          >
            <Pencil size={16} />
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(entry);
            }}
            className="flex items-center gap-2 w-full text-left hover:bg-gray-100 px-2 py-1 rounded text-sm text-red-600"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </PopoverContent>
      </Popover>
    </div>
  );
};
