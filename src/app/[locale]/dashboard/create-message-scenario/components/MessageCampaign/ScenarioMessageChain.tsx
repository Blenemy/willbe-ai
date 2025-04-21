"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  MessageEntry,
  useMessageCampaignEntries,
  useMessageCampaignEntry,
} from "@/hooks/useMessageCampaignEntries";
import {
  useCreateMessageEntry,
  useDeleteMessageEntry,
  useUpdateMessageEntry,
} from "@/hooks/useMessageEntry";
import { MessageEntryCards } from "./MessageEntryCards";
import { CreateMessageModal } from "./CreateMessageModal";
import { CreateScenarioTable } from "./CreateScenarioTable";
import { Button } from "@/components/ui/button";
import {
  MessageType,
  useMessageChainStore,
} from "@/store/useMessageChainStore";
import { toast } from "sonner";
import { useDownloadMessageEntryCsv } from "@/hooks/useDownloadMessageEntryCsv";

interface Props {
  scenarioId: string;
}

export const ScenarioMessageChain = ({ scenarioId }: Props) => {
  const t = useTranslations("messageChain");
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [editMode, setEditMode] = useState<"create" | "edit">("create");
  const [editingEntry, setEditingEntry] = useState<MessageEntry | null>(null);

  const { data: messageEntries } = useMessageCampaignEntries(scenarioId);
  const { data: selectedEntry } = useMessageCampaignEntry(
    selectedEntryId ?? undefined
  );
  const { mutate: createEntry } = useCreateMessageEntry();
  const { mutate: updateEntry } = useUpdateMessageEntry();
  const { mutate: deleteEntry } = useDeleteMessageEntry();

  useEffect(() => {
    if (messageEntries?.length && !selectedEntryId) {
      setSelectedEntryId(messageEntries[0].id);
    }
  }, [messageEntries, selectedEntryId]);

  useEffect(() => {
    if (messageEntries) {
      useMessageChainStore.getState().setEntries(messageEntries);
    }
  }, [messageEntries]);

  const handleCreateEntry = (type: string, sendDate: string) => {
    const { valid, reason } = useMessageChainStore
      .getState()
      .canCreateEntry(type as MessageType);

    if (!valid) {
      toast.error(reason);
      return;
    }

    createEntry({
      messageScenarioId: scenarioId,
      type,
      sendDate,
      sendNow: true,
    });
    setCreateModalOpen(false);
  };

  const handleEditEntry = (entryId: string, type: string, sendDate: string) => {
    updateEntry({ id: entryId, type, sendDate, messageScenarioId: scenarioId });
    setCreateModalOpen(false);
  };

  const handleOpenEditModal = (entry: MessageEntry) => {
    setEditingEntry(entry);
    setEditMode("edit");
    setCreateModalOpen(true);
  };

  const handleDeleteEntry = (entry: MessageEntry) => {
    deleteEntry({ id: entry.id, messageScenarioId: scenarioId });
    if (selectedEntryId === entry.id) {
      setSelectedEntryId(null);
    }
  };

  const { refetch: downloadCsv } = useDownloadMessageEntryCsv(
    selectedEntryId,
    false
  );
  const { refetch: downloadCsvWithEmails } = useDownloadMessageEntryCsv(
    selectedEntryId,
    true
  );

  // console.log(selectedEntry?.messageEntryLeadData);

  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-lg font-medium">{t("title")}</h3>

      <MessageEntryCards
        entries={messageEntries || []}
        selectedId={selectedEntryId}
        onSelect={(id) => setSelectedEntryId(id)}
        onOpenCreateModal={() => {
          setEditMode("create");
          setEditingEntry(null);
          setCreateModalOpen(true);
        }}
        onOpenEditModal={handleOpenEditModal}
        onDelete={handleDeleteEntry}
      />

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={!selectedEntryId}
            onClick={async () => {
              const res = await downloadCsv();
              if (res.data) {
                const link = document.createElement("a");
                link.href = res.data;
                link.download = "message_entry.csv";
                link.click();
              }
            }}
          >
            {t("exportCsv")}
          </Button>
          <Button
            variant="outline"
            disabled={!selectedEntryId}
            onClick={async () => {
              const res = await downloadCsvWithEmails();
              if (res.data) {
                const link = document.createElement("a");
                link.href = res.data;
                link.download = "message_entry_with_emails.csv";
                link.click();
              }
            }}
          >
            {t("exportCsvWithEmails")}
          </Button>
        </div>
      </div>

      <CreateMessageModal
        open={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onAdd={handleCreateEntry}
        onEdit={handleEditEntry}
        mode={editMode}
        initialData={
          editingEntry
            ? {
                id: editingEntry.id,
                type: editingEntry.type,
                sendDate: editingEntry.sendDate,
              }
            : undefined
        }
      />

      {selectedEntry && (
        <CreateScenarioTable
          leads={selectedEntry.messageEntryLeadData}
          onSend={() => console.log("Send messages")}
        />
      )}
    </div>
  );
};
