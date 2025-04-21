import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { protectedAxiosInstance } from "@/api/axiosInstance";
import { toast } from "sonner";

type Template = {
  language: string;
};

type MessageStructure = {
  id: string;
  name: string;
  templates: Template[];
};

type CompanyProduct = {
  id: string;
  name: string;
};

export interface MessageEntryData {
  messageScenarioId: string;
  phone: string;
  productServiceId: string;
  messageStructures: MessageStructure[];
  role: string;
  id: string;
  firstName: string;
  lastname: string;
  email: string | null;
  language: string | null;
  languages: string[];
  company: string;
  companyProducts: CompanyProduct[];
  createdAt: string;
  leadId: string;
  message: string | null;
  messageEntryId: string;
  messageStructure: MessageStructure | null;
  messageStructureId: string | null;
}

export interface MessageEntry {
  id: string;
  messageScenarioId: string;
  type: string;
  sendDate: string;
  sendNow: boolean;
  messageEntryLeadData: MessageEntryData[];
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

interface UpdateMessageEntryLeadDto {
  leadId: string;
  email?: string | null;
  phone?: string | null;
  message?: string | null;
  language?: string | null;
  messageStructureId?: string | null;
  productServiceId?: string | null;
}

export const useUpdateMessageEntryLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ leadId, ...data }: UpdateMessageEntryLeadDto) => {
      const response = await protectedAxiosInstance.patch(
        `/auth/message-campaign-entries/leads/${leadId}`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["message-campaign-entry"],
      });
      queryClient.invalidateQueries({
        queryKey: ["message-campaign-entries"],
      });
    },
    onError: (err) => {
      toast(`Error updating the lead data ${err.message}`);
    },
  });
};
