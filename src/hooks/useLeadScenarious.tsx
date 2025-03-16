import { protectedAxiosInstance } from "@/api/axiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { LeadScenarios } from "@/types/LeadScenarios";
import { useRouter } from "next/navigation";

interface APIRequestErrorPayload {
  message: string;
  statusCode: number;
}

interface UseAuthProps {
  enableFetch: boolean;
  scenarioId?: string | null;
}

export const useLeadScenarios = ({
  enableFetch = false,
  scenarioId,
}: UseAuthProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: leadScenariousTableData } = useQuery<LeadScenarios[]>({
    queryKey: ["lead-scenarios"],
    queryFn: async () => {
      const response = await protectedAxiosInstance.get(`/auth/lead-scenarios`);
      return response.data;
    },
    retry: true,
    staleTime: 1000 * 60 * 5,
    enabled: enableFetch,
  });

  const { data: leadScenarioById } = useQuery<LeadScenarios[]>({
    queryKey: ["lead-scenarios-by-id", scenarioId],
    queryFn: async () => {
      const response = await protectedAxiosInstance.get(
        `/auth/lead-scenarios/${scenarioId}`
      );
      return response.data;
    },
    retry: true,
    staleTime: 1000 * 60 * 5,
    enabled: !!scenarioId,
  });

  const deleteLeadScenarious = useMutation({
    mutationFn: async (payload: { id: string }) => {
      const response = await protectedAxiosInstance.delete(
        `/auth/lead-scenarios/${payload.id}`
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Lead Scenario was created");
      queryClient.invalidateQueries({ queryKey: ["lead-scenarios"] });
    },
    onError: (error: AxiosError<APIRequestErrorPayload>) => {
      toast.error(
        error.response?.data.message || "Failure to delete a scenario"
      );
    },
  });

  const postLeadScenarious = useMutation({
    mutationFn: async (payload: { name: string }) => {
      const response = await protectedAxiosInstance.post(
        `/auth/lead-scenarios/`,
        payload
      );
      return response.data;
    },
    onSuccess: (data: LeadScenarios) => {
      toast.success("Lead Scenario was deleted");
      queryClient.invalidateQueries({ queryKey: ["lead-scenarios"] });
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set("scenarioId", data.id.toString());
      currentUrl.searchParams.set("scenarioName", data.name.toString());

      router.push(currentUrl.toString(), undefined);
    },
    onError: (error: AxiosError<APIRequestErrorPayload>) => {
      toast.error(
        error.response?.data.message || "Failure to create a scenario"
      );
    },
  });

  const updateLeadScenario = useMutation({
    mutationFn: async (payload: { name: string; filterId: string }) => {
      const response = await protectedAxiosInstance.patch(
        `/auth/lead-scenarios/${payload.filterId}`,
        payload
      );
      return response.data;
    },
    onSuccess: (data: LeadScenarios) => {
      toast.success("Lead Scenario was updated");
      queryClient.invalidateQueries({ queryKey: ["lead-scenarios-by-id"] });
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set("scenarioId", data.id.toString());
      currentUrl.searchParams.set("scenarioName", data.name.toString());

      router.push(currentUrl.toString(), undefined);
    },
    onError: (error: AxiosError<APIRequestErrorPayload>) => {
      toast.error(
        error.response?.data.message || "Failure to update the scenario"
      );
    },
  });

  return {
    leadScenariousTableData,
    leadScenarioById,
    postLeadScenarious: postLeadScenarious.mutate,
    updateLeadScenario: updateLeadScenario.mutate,
    deleteLeadScenarious: deleteLeadScenarious.mutate,
  };
};
