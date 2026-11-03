import { protectedAxiosInstance } from "@/api/axiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface User {
  firstName: string;
  lastName: string;
}

export interface Tenure {
  years: number;
  months: number;
}

export interface CurrentPosition {
  company: string;
  company_id: string;
  description: string;
  industry: string[];
  location: string;
  role: string;
  tenure_at_company: Tenure;
  tenure_at_role: Tenure;
}

export interface LeadData {
  id: string;
  first_name: string;
  last_name: string;
  name: string;
  headline: string;
  industry: string | null;
  location: string;
  current_positions: CurrentPosition[];
  network_distance: string;
  pending_invitation: boolean;
  profile_picture_url: string;
  profile_picture_url_large: string;
  profile_url: string;
  public_identifier: string;
  public_profile_url: string;
  member_urn: string;
  type: string;
}

export interface MessageScenarioLead {
  id: string;
  leadId: string;
  messageScenarioId: string;
  createdAt: string;
  updatedAt: string;
  accountId: string;
  companyId: string | null;
  hubspotContactId: string | null;
  isSyncedWithCrm: boolean;
  leadData: LeadData;
}

export interface Scenario {
  id: string;
  name: string;
  status: string;
  user: User;
  leadsInCadence: number;
  messagesSent: number;
  responseRate: number;
  meetingRate: number;
  bounceRate: number;
  outOfOfficeRate: number;
  createdAt: string;
  updatedAt: string;
  leads: MessageScenarioLead[];
}

interface GetScenariosParams {
  name?: string;
  limit?: number;
  offset?: number;
}

export const useMessageScenarios = (params: GetScenariosParams = {}) => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ([_, value]) => value !== undefined && value !== ""
    )
  );

  return useQuery({
    queryKey: ["message-scenarios", cleanParams],
    queryFn: async () => {
      const response = await protectedAxiosInstance.get<Scenario[]>(
        "/auth/message-scenarios",
        {
          params: cleanParams,
        }
      );
      return response.data;
    },
  });
};

interface CreateScenarioPayload {
  name: string;
}

export const useCreateMessageScenario = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: CreateScenarioPayload) => {
      const res = await protectedAxiosInstance.post(
        "/auth/message-scenarios",
        data
      );
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["message-scenarios"] });
      router.push(`/dashboard/create-message-scenario/${data.id}`);
      toast("Message scenario was successfully created");
    },
    onError: () => {
      toast("Failed to create a message scenario");
    },
  });
};

interface UpdateScenarioPayload extends CreateScenarioPayload {
  id: string;
}

export const useUpdateMessageScenario = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateScenarioPayload) => {
      const res = await protectedAxiosInstance.patch(
        `/auth/message-scenarios/${data.id}`,
        data
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["message-scenarios"] });
      toast("Message scenario was successfully updated");
    },
    onError: () => {
      toast("Failed to update a message scenario");
    },
  });
};

export const useMessageScenarioById = (id?: string) => {
  return useQuery({
    queryKey: ["message-scenario", id],
    queryFn: async () => {
      const response = await protectedAxiosInstance.get<Scenario>(
        `/auth/message-scenarios/${id}`
      );
      return response.data;
    },
    enabled: !!id,
  });
};

interface PostLeadsToMessageScenarios {
  id: string;
  leadsIds: string[];
}

export const usePostMessageScenarioLeads = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PostLeadsToMessageScenarios) => {
      const payload = { leadsIds: data.leadsIds };
      const res = await protectedAxiosInstance.post(
        `/auth/message-scenarios/${data.id}/add-leads`,
        payload
      );
      return res.data;
    },
    onSuccess: () => {
      toast("Leads were successfully added to a message scenario");
      queryClient.invalidateQueries({ queryKey: ["message-campaign-entry"] });
    },
    onError: () => {
      toast("Failed to add leads to a message scenario");
    },
  });
};

export const useDeleteMessageScenarios = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      await protectedAxiosInstance.delete("/auth/message-scenarios", {
        data: {
          messageScenariosIds: ids,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["message-scenarios"] });
      toast("Message scenario(s) deleted successfully");
    },
    onError: () => {
      toast("Failed to delete message scenario(s)");
    },
  });
};
