import { useQuery } from "@tanstack/react-query";
import { protectedAxiosInstance } from "@/api/axiosInstance";

export interface ScenarioMessage {
  id: string;
  leadScenarioId: string;
  isSent: boolean;
  status: string;
  leadData: {
    first_name: string;
    last_name: string;
    name: string;
    headline: string;
    location: string;
    summary: string;
    type: string;
    industry: string | null;
    public_identifier: string;
    public_profile_url: string;
    profile_url: string;
    profile_picture_url: string;
    profile_picture_url_large: string;
    member_urn: string;
    network_distance: string;
    pending_invitation: boolean;
    current_positions: {
      role: string;
      company: string;
      location?: string;
      company_id?: string;
      industry?: string[];
    }[];
  };
  sentMessages: {
    id: string;
    emailMessageId: string;
    messageEntryLeadDataId: string;
    messageEntryId: string;
    messageScenarioId: string;
    status: string;
    sentAt: string;
    respondedAt: string;
    message: string;
  }[];
  receivedMessages: {
    id: string;
    messageId: string;
    messageScenarioId: string;
    sentEmailMessageId: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export const useStatisticMessages = (scenarioId: string) => {
  return useQuery<ScenarioMessage[]>({
    queryKey: ["scenario-messages", scenarioId],
    queryFn: async () => {
      const res = await protectedAxiosInstance.get(
        `/auth/message-scenarios/${scenarioId}/messages`
      );
      return res.data;
    },
    enabled: !!scenarioId,
  });
};
