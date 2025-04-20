import { MessageEntry } from "@/hooks/useMessageCampaignEntries";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import LinkedinIcon from "@/assets/linkedin.svg";
import MailIcon from "@/assets/email.svg";
import Image from "next/image";

interface Props {
  entries: MessageEntry[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onOpenCreateModal: () => void;
  onOpenEditModal: (entry: MessageEntry) => void;
  onDelete: (entry: MessageEntry) => void;
}

const COMMON_ICON_SIZE = 18;

const getIcon = (type: string) => {
  const src = type.toLowerCase().includes("linkedin") ? LinkedinIcon : MailIcon;

  return (
    <Image
      src={src}
      alt={type}
      width={COMMON_ICON_SIZE}
      height={COMMON_ICON_SIZE}
    />
  );
};
export const MessageEntryCards = ({
  entries,
  selectedId,
  onSelect,
  onOpenCreateModal,
  onOpenEditModal,
  onDelete,
}: Props) => {
  return (
    <div className="flex items-center gap-3">
      {entries.map((entry, index) => (
        <div
          key={entry.id}
          className={`flex items-center border rounded-full py-2 px-3 text-sm cursor-pointer ${
            selectedId === entry.id
              ? "bg-blue-100 border-blue-500"
              : "border-gray-300"
          }`}
          onClick={() => onSelect(entry.id)}
        >
          <div className="mr-2">{getIcon(entry.type)}</div>
          <span className="font-semibold text-sm mr-3">
            #{index + 1} {entry.type}
          </span>
          <div className="flex gap-2">
            <Pencil
              className="cursor-pointer"
              size={COMMON_ICON_SIZE}
              fill="#5F5F5F"
              onClick={(e) => {
                e.stopPropagation();
                onOpenEditModal(entry);
              }}
            />
            {entry.type !== "first_email" && (
              <Trash2
                className="text-pink-500 cursor-pointer"
                size={COMMON_ICON_SIZE}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(entry);
                }}
              />
            )}
          </div>
        </div>
      ))}

      <div className="flex">
        <Button
          onClick={onOpenCreateModal}
          className="flex items-center justify-center w-7 h-7 rounded-full border border-none text-[#5F5F5F] hover:bg-gray-100"
          type="button"
          variant={"outline"}
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};
