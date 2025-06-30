import { protectedAxiosInstance } from "@/api/axiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { LeadPreset } from "@/types/LeadPreset";
import { LeadFilter } from "@/types/LeadFilter";

interface APIRequestErrorPayload {
  message: string;
  statusCode: number;
}

interface UseAuthProps {
  enableFetch: boolean;
  filterId?: string | null;
}

export const useLeadFilters = ({
  enableFetch = false,
  filterId,
}: UseAuthProps) => {
  const queryClient = useQueryClient();

  const { data: leadFiltersTableData } = useQuery<LeadPreset[]>({
    queryKey: ["lead-filters"],
    queryFn: async () => {
      const response = await protectedAxiosInstance.get(
        `/auth/lead-scenarios-filters`
      );
      return response.data;
    },
    retry: true,
    staleTime: 1000 * 60 * 5,
    enabled: enableFetch,
  });

  const { data: leadFilterById } = useQuery<LeadFilter>({
    queryKey: ["lead-scenarios-by-id", filterId],
    queryFn: async () => {
      const response = await protectedAxiosInstance.get(
        `/auth/lead-scenarios-filters/${filterId}`
      );
      return response.data;
    },
    retry: true,
    staleTime: 1000 * 60 * 5,
    enabled: !!filterId,
  });

  const createLeadFilter = useMutation({
    mutationFn: async (payload: {
      leadScenarioId: string;
      name?: string;
      filterValues: never[];
    }) => {
      const response = await protectedAxiosInstance.post(
        `/auth/lead-scenarios-filters`,
        payload
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Lead Scenario was created");
      queryClient.invalidateQueries({
        queryKey: ["lead-filters"],
      });
      queryClient.invalidateQueries({
        queryKey: ["leads"],
      });
      queryClient.invalidateQueries({
        queryKey: ["lead-scenarios-by-id"],
      });
    },
    onError: (error: AxiosError<APIRequestErrorPayload>) => {
      toast.error(
        error.response?.data.message || "Failure to create the filter"
      );
    },
  });

  const deleteLeadFilter = useMutation({
    mutationFn: async (payload: { id: string }) => {
      const response = await protectedAxiosInstance.delete(
        `/auth/lead-scenarios-filters/${payload.id}`
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Lead Scenario was deleted");
      queryClient.invalidateQueries({
        queryKey: ["lead-filters"],
      });
    },
    onError: (error: AxiosError<APIRequestErrorPayload>) => {
      toast.error(
        error.response?.data.message || "Failure to delete the filter"
      );
    },
  });

  return {
    createLeadFilter: createLeadFilter.mutateAsync,
    deleteLeadFilter: deleteLeadFilter.mutate,
    leadFiltersTableData,
    leadFilterById,
  };
};
