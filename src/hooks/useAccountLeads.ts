import { useQuery } from "@tanstack/react-query";
import { protectedAxiosInstance } from "@/api/axiosInstance";

export interface AccountPageTableData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
}

interface UseAccountLeadsOptions {
  accountId?: string;
  search?: string;
  limit?: number;
  offset?: number;
  enabled?: boolean;
}

export const useAccountLeads = ({
  accountId,
  search = "",
  limit = 10,
  offset = 0,
  enabled = true,
}: UseAccountLeadsOptions) => {
  return useQuery<AccountPageTableData[]>({
    queryKey: ["account-leads", accountId, search, limit, offset],
    queryFn: async () => {
      const res = await protectedAxiosInstance.get(
        `/auth/accounts/${accountId}/leads`,
        {
          params: {
            keywords: search,
            limit,
            offset,
          },
        }
      );
      return res.data;
    },
    enabled: enabled && !!accountId,
  });
};
