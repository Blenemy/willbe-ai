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
import { useMessageChainStore } from "@/store/useMessageChainStore";

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

  const handleCreateEntry = (
    type: string,
    sendDate: string,
    sendNow: boolean
  ) => {
    const payload: {
      messageScenarioId: string;
      type: string;
      sendNow: boolean;
      sendDate?: string;
    } = {
      messageScenarioId: scenarioId,
      type,
      sendNow,
    };

    if (!sendNow) {
      payload.sendDate = sendDate;
    }

    createEntry(payload);
    setCreateModalOpen(false);
  };

  const handleEditEntry = (
    entryId: string,
    type: string,
    sendDate: string,
    sendNow: boolean
  ) => {
    const payload: {
      id: string;
      type: string;
      messageScenarioId: string;
      sendNow?: boolean;
      sendDate?: string;
    } = {
      id: entryId,
      type,
      messageScenarioId: scenarioId,
    };

    if (sendNow) {
      payload.sendNow = true;
    } else {
      payload.sendDate = sendDate;
    }

    updateEntry(payload);
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
          selectedEntry={selectedEntry}
        />
      )}
    </div>
  );
};
