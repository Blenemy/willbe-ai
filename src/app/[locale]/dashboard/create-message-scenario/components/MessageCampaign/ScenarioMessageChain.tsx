"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
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
import { CreateMessageModal } from "./CreateMessageModal";
import { CreateScenarioTable } from "./CreateScenarioTable";
import { useMessageChainStore } from "@/store/useMessageChainStore";
import { ScenarioCalendar } from "./ScenarioCalendar";
import { ScenarioCalendarStats } from "./ScenarioCalendarStats";

interface Props {
  scenarioId: string;
  scenarioTitle: string;
  setActiveStep: Dispatch<SetStateAction<number>>;
}

export const ScenarioMessageChain = ({
  scenarioId,
  scenarioTitle,
  setActiveStep,
}: Props) => {
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

  const handleDeleteEntry = (entry: MessageEntry) => {
    deleteEntry({ id: entry.id, messageScenarioId: scenarioId });
    if (selectedEntryId === entry.id) {
      setSelectedEntryId(null);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <ScenarioCalendar
        scenarioTitle={scenarioTitle}
        entries={messageEntries || []}
        onAddStep={() => {
          setEditMode("create");
          setEditingEntry(null);
          setCreateModalOpen(true);
        }}
        onEditStep={(entry) => {
          setEditMode("edit");
          setEditingEntry(entry);
          setCreateModalOpen(true);
        }}
        onDeleteStep={handleDeleteEntry}
        onSelectStep={(id) => setSelectedEntryId(id)}
        selectedEntryId={selectedEntryId}
      />

      <ScenarioCalendarStats entries={messageEntries || []} />

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
          setActiveStep={setActiveStep}
        />
      )}
    </div>
  );
};
