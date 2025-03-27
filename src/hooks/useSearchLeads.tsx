import { protectedAxiosInstance } from "@/api/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { LeadSearchResponse } from "@/types/LeadSearch";

interface UseSearchLeadsProps {
  enableFetch: boolean;
  scenarioId?: string | null;
  limit?: number;
  cursor?: string | null;
}

export const useSearchLeads = ({
  enableFetch,
  scenarioId,
  limit = 10,
  cursor = null,
}: UseSearchLeadsProps) => {
  // const queryClient = useQueryClient();

  const { data: searchLeads } = useQuery<LeadSearchResponse>({
    queryKey: ["search-leads", scenarioId, limit, cursor],
    queryFn: async () => {
      const response = await protectedAxiosInstance.get(
        `/auth/lead-scenarios/${scenarioId}/leads`,
        {
          params: {
            limit,
            cursor,
          },
        }
      );
      return response.data;
    },
    enabled: enableFetch && !!scenarioId,
    staleTime: 1000 * 60 * 5,
  });

  // const deleteSavedAccounts = useMutation({
  //   mutationFn: async (id: string) => {
  //     const response = await protectedAxiosInstance.delete(
  //       `/auth/account-scenarios/saved-accounts/${id}`
  //     );
  //     return response.data;
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["accounts-saved"] });
  //     toast("Account was deleted succesfully");
  //   },
  //   onError: (error: AxiosError<APIRequestErrorPayload>) => {
  //     const errorMessage =
  //       error.response?.data.message || "Failed to delete saved account";
  //     toast(errorMessage);
  //   },
  // });

  return {
    searchLeads: searchLeads?.items || [],
    paging: searchLeads?.paging,
    cursor: searchLeads?.cursor || null,
    // deleteSavedAccounts: deleteSavedAccounts.mutate,
  };
};
