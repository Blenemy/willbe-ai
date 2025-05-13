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

export interface MessageEntryStructure {
  messageStructure: {
    id: string;
    name: string;
    templates: [
      {
        language: string;
      }
    ];
  } | null;
  messageStructures:
    | [
        {
          id: string;
          name: string;
          templates: [
            {
              language: string;
            }
          ];
        }
      ]
    | null;
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
  return useQuery<MessageEntry | MessageEntryStructure>({
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

export const useDeleteMessageCampaignEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      leadsIds,
      id,
    }: {
      leadsIds: string[];
      id: string;
    }) => {
      const response = await protectedAxiosInstance.delete(
        `/auth/message-scenarios/${id}/remove-leads`,
        {
          data: {
            leadsIds,
          },
        }
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
      queryClient.invalidateQueries({
        queryKey: ["leads-in-cadence"],
      });

      toast("Lead was deleted succesfully");
    },
    onError: (err) => {
      toast(`Error updating the lead data ${err.message}`);
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
  status?: string;
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
      toast(`Lead data updated sucessfully`);
      queryClient.invalidateQueries({
        queryKey: ["message-campaign-entry"],
      });
      queryClient.invalidateQueries({
        queryKey: ["message-campaign-entries"],
      });
      queryClient.invalidateQueries({
        queryKey: ["leads-in-cadence"],
      });
    },
    onError: (err) => {
      toast(`Error updating the lead data ${err.message}`);
    },
  });
};
