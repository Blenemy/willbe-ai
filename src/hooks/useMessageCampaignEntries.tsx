import { useQuery } from "@tanstack/react-query";
import { protectedAxiosInstance } from "@/api/axiosInstance";

export interface MessageEntryData {
  id: string;
  messageEntryId: string;
  messageScenarioId: string;
  email: string;
  phone: string;
  language: string;
  messageStructureId: string;
  productServiceId: string;
  message: string;
}

export interface MessageEntry {
  id: string;
  messageScenarioId: string;
  type: string;
  sendDate: string;
  sendNow: boolean;
  messageEntryData: MessageEntryData[];
}

export const useMessageCampaignEntries = (messageScenarioId?: string) => {
  return useQuery<MessageEntry[]>({
    queryKey: ["message-campaign-entries", messageScenarioId],
    enabled: !!messageScenarioId,
    queryFn: async () => {
      const res = await protectedAxiosInstance.get<MessageEntry[]>(
        `/auth/message-campaign-entries`,
        { params: { messageScenarioId } }
      );
      return res.data;
    },
  });
};

export const useMessageCampaignEntry = (id?: string) => {
  return useQuery<MessageEntry>({
    queryKey: ["message-campaign-entry", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await protectedAxiosInstance.get<MessageEntry>(
        `/auth/message-campaign-entries/${id}`
      );
      return res.data;
    },
  });
};
