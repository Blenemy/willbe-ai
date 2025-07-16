import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { protectedAxiosInstance } from "@/api/axiosInstance";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { AccountSearch } from "@/types/AccountSearch";

interface UsePaginatedAccountsSearchProps {
  accountId: string;
  limit: number;
  cursor?: string | null;
  queryString?: string;
  enabled?: boolean;
}

interface PaginatedResponse {
  items: AccountSearch[];
  cursor: string | null;
  pageIndex: number;
  previousPageCursor: string | null;
  paging: {
    start: number;
    page_count: number;
    total_count: number;
  };
}

interface AccountData {
  type: string;
  id: string;
  name: string;
  profile_url: string;
  summary: string;
  industry: string;
  location: string;
  headcount: string;
  logo: string;
}

export const usePaginatedAccountsSearch = ({
  accountId,
  limit,
  cursor,
  queryString,
  enabled = true,
}: UsePaginatedAccountsSearchProps) => {
  const queryClient = useQueryClient();

  const query = useQuery<PaginatedResponse>({
    queryKey: ["account-search", accountId, limit, cursor, queryString],
    queryFn: async () => {
      const res = await protectedAxiosInstance.get(
        `/auth/account-scenarios/${accountId}/accounts`,
        {
          params: {
            limit,
            cursor,
            query: queryString,
          },
        }
      );
      return res.data;
    },
    enabled: !!accountId && enabled,
  });

  const saveSelectedAccounts = useMutation({
    mutationFn: async ({
      accountScenarioId,
      accounts,
    }: {
      accountScenarioId: string;
      accounts: AccountData[];
    }) => {
      return await protectedAxiosInstance.post(
        `/auth/account-scenarios/${accountScenarioId}/accounts`,
        { accounts }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["accounts-saved"],
      });
      queryClient.invalidateQueries({
        queryKey: ["account-search"],
      });
      toast.success("Selected companies saved successfully");
    },
    onError: (error: AxiosError) => {
      console.error(error);
      toast.error("Failed to save selected companies");
    },
  });

  return {
    ...query,
    isFetching: query.isFetching,
    saveSelectedAccounts: saveSelectedAccounts.mutateAsync,
    saveError: saveSelectedAccounts.error,
  };
};
