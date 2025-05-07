import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { protectedAxiosInstance } from "@/api/axiosInstance";

export interface User {
  firstName: string;
  lastName: string;
}

export interface LeadScenario {
  id: string;
  name: string;
  status: string;
  userId: string;
  filterId: string;
  createdAt: string;
  updatedAt: string;
  user: User;
}

export interface AccountScenarioData {
  id: string;
  logo: string;
  name: string;
  type: string;
  summary: string;
  industry: string;
  location: string | null;
  headcount: string;
  profile_url: string;
  createBy: string;
}

export interface AccountScenario {
  id: string;
  accountData:
    | {
        id: string;
        accountScenarioId: string;
        accountData: AccountScenarioData;
      }
    | AccountScenarioData;
}
export interface LeadPosition {
  role: string;
  company: string;
  industry: string[];
  location: string;
  company_id: string;
  description: string;
  tenure_at_role: {
    months: number;
  };
  tenure_at_company: {
    years: number;
    months: number;
  };
}

export interface LeadData {
  id: string;
  name: string;
  type: string;
  summary: string;
  headline: string;
  industry: string | null;
  location: string;
  last_name: string;
  first_name: string;
  member_urn: string;
  profile_url: string;
  network_distance: string;
  current_positions: LeadPosition[];
  public_identifier: string;
  pending_invitation: boolean;
  public_profile_url: string;
  profile_picture_url: string;
  profile_picture_url_large: string;
}

export interface Lead {
  id: string;
  leadData: LeadData;
  leadScenarioId: string;
  createdAt: string;
  updatedAt: string;
}

export const useLeadScenarios = () => {
  return useQuery<LeadScenario[]>({
    queryKey: ["lead-scenarios"],
    queryFn: async () => {
      const res = await protectedAxiosInstance.get("/auth/lead-scenarios");
      return res.data;
    },
  });
};

type AccountData = {
  id: string;
  logo: string;
  name: string;
  type: "COMPANY" | string;
  summary: string;
  industry: string;
  location: string | null;
  headcount: string;
  profile_url: string;
};

export type AccountRecord = {
  id: string;
  accountData: AccountData;
  createdAt: string;
  isSyncedWithCrm: boolean;
  createdBy: string;
};

export const useSavedAccounts = () => {
  return useQuery<AccountRecord[]>({
    queryKey: ["saved-accounts"],
    queryFn: async () => {
      const res = await protectedAxiosInstance.get(
        "/auth/account-scenarios/saved-accounts"
      );
      return res.data;
    },
  });
};

export const useDeleteSavedAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (accountId: string) => {
      await protectedAxiosInstance.delete(
        `/auth/account-scenarios/saved-accounts/${accountId}`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-accounts"] });
    },
  });
};

export const useLeadsByAccountsAndScenarios = () => {
  return useMutation<
    Lead[],
    unknown,
    { accountsIds: string[]; leadScenariosIds: string[] }
  >({
    mutationFn: async (payload) => {
      const res = await protectedAxiosInstance.post(
        "/auth/lead-scenarios/leads-by-accounts-and-scenarios",
        payload
      );
      return res.data;
    },
  });
};
