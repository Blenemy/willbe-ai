import { create } from "zustand";
import { MessageEntry } from "@/hooks/useMessageCampaignEntries";

export type MessageType =
  | "first_email"
  | "linkedin_connection"
  | "follow_up_email"
  | "linkedin_message";

interface MessageChainStore {
  entries: MessageEntry[];
  setEntries: (entries: MessageEntry[]) => void;
  canCreateEntry: (
    type: MessageType,
    ignoreId?: string
  ) => { valid: boolean; reason?: string };
  getAvailableMessageTypes: (ignoreId: string) => MessageType[];
}

export const useMessageChainStore = create<MessageChainStore>((set, get) => ({
  entries: [],

  setEntries: (entries) => set({ entries }),

  canCreateEntry: (type, ignoreId) => {
    const entries = get().entries.filter((e) => e.id !== ignoreId);
    const hasFirstEmail = entries.some((e) => e.type === "first_email");
    const hasLinkedinConnection = entries.some(
      (e) => e.type === "linkedin_connection"
    );
    const isFirst = entries.length === 0;

    const firstTypeAllowed = [
      "first_email",
      "linkedin_connection",
      "linkedin_message",
    ];

    if (isFirst && !firstTypeAllowed.includes(type)) {
      return {
        valid: false,
        reason: "First message must be email or LinkedIn.",
      };
    }

    if (
      (type === "follow_up_email" || type === "linkedin_message") &&
      !hasFirstEmail &&
      !hasLinkedinConnection
    ) {
      return {
        valid: false,
        reason: "You must add an email or LinkedIn connection first.",
      };
    }

    if (type === "first_email" && hasFirstEmail) {
      return { valid: false, reason: "Only one first email allowed." };
    }

    if (type === "linkedin_connection" && hasLinkedinConnection) {
      return {
        valid: false,
        reason: "Only one LinkedIn connection allowed.",
      };
    }

    return { valid: true };
  },

  getAvailableMessageTypes: (ignoreId: string) => {
    const types: MessageType[] = [
      "first_email",
      "linkedin_connection",
      "follow_up_email",
      "linkedin_message",
    ];

    return types.filter((type) => {
      return get().canCreateEntry(type, ignoreId).valid;
    });
  },
}));
