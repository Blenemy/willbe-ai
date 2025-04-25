import { create } from "zustand";
import { MessageEntry } from "@/hooks/useMessageCampaignEntries";

export type MessageType =
  | "first_email"
  | "linkedin_connection"
  | "follow_up_email"
  | "linkedin_message"
  | "linkedin_follow_up";

interface MessageChainStore {
  entries: MessageEntry[];
  setEntries: (entries: MessageEntry[]) => void;
  canCreateEntry: (
    type: MessageType,
    ignoreId?: string
  ) => { valid: boolean; reason?: string };
  getAvailableMessageTypes: (ignoreId: string) => MessageType[];
  shouldAllowSendNowCheckbox: (type: MessageType) => boolean;
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
    const hasLinkedinMessage = entries.some(
      (e) => e.type === "linkedin_message"
    );
    const isFirst = entries.length === 0;

    const firstTypeAllowed: MessageType[] = [
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

    if (type === "follow_up_email" && !hasFirstEmail) {
      return {
        valid: false,
        reason: "Follow-up Email requires a First Email first.",
      };
    }

    if (type === "linkedin_message" && !hasLinkedinConnection) {
      return {
        valid: false,
        reason: "LinkedIn Message requires a LinkedIn Connection first.",
      };
    }

    if (type === "linkedin_follow_up" && !hasLinkedinMessage) {
      return {
        valid: false,
        reason: "Follow-up LinkedIn requires a LinkedIn Message first.",
      };
    }

    if (type === "first_email" && hasFirstEmail) {
      return { valid: false, reason: "Only one First Email is allowed." };
    }

    if (type === "linkedin_connection" && hasLinkedinConnection) {
      return {
        valid: false,
        reason: "Only one LinkedIn Connection is allowed.",
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
      "linkedin_follow_up",
    ];

    return types.filter((type) => get().canCreateEntry(type, ignoreId).valid);
  },

  shouldAllowSendNowCheckbox: (type: MessageType): boolean => {
    return type === "first_email" || type === "linkedin_connection";
  },
}));
