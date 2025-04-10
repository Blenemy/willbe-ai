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
  const { data: searchLeads, isFetching } = useQuery<LeadSearchResponse>({
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

  return {
    isFetching,
    searchLeads: searchLeads?.items || [],
    paging: searchLeads?.paging,
    cursor: searchLeads?.cursor || null,
  };
};
