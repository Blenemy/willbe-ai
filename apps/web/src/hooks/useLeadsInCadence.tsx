import { useQuery } from "@tanstack/react-query";
import { protectedAxiosInstance } from "@/api/axiosInstance";

export interface CurrentPosition {
  role: string;
  company: string;
  company_id: string;
  industry: string[] | null;
  location: string;
}

export interface LeadData {
  id: string;
  name: string;
  first_name: string;
  last_name: string;
  member_urn: string;
  public_identifier: string;
  public_profile_url: string;
  profile_url: string;
  profile_picture_url: string;
  profile_picture_url_large: string;
  network_distance: string;
  location: string;
  headline: string;
  summary: string;
  industry: string | null;
  pending_invitation: boolean;
  current_positions: CurrentPosition[];
  type: string;
}

export interface Lead {
  id: string;
  leadScenarioId: string;
  leadId: string;
  messageEntryId: string;
  messageStructureId: string;
  productServiceId: string;
  status: "in_cadence" | "response" | "meeting" | "bounced";
  message: string;
  email: string;
  language: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
  lead: {
    createdAt: string;
    updatedAt: string;
    id: string;
    leadData: LeadData;
  };
  messageEntry: {
    id: string;
    type: string;
    messageScenarioId: string;
    sendDate: string;
    sendNow: boolean;
    createdAt: string;
    updatedAt: string;
  };
}
export const useLeadsInCadence = (scenarioId?: string) => {
  return useQuery({
    queryKey: ["leads-in-cadence", scenarioId],
    queryFn: async () => {
      const res = await protectedAxiosInstance.get<Lead[]>(
        `/auth/message-scenarios/${scenarioId}/leads-in-cadence`
      );
      return res.data;
    },
    enabled: !!scenarioId,
  });
};
