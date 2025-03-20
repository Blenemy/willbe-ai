import { protectedAxiosInstance } from "@/api/axiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { Lead, LeadScenarios } from "@/types/LeadScenarios";
import { useRouter } from "next/navigation";

interface APIRequestErrorPayload {
  message: string;
  statusCode: number;
}

interface UseAuthProps {
  enableFetch: boolean;
  acconutId?: string | null;
}

export const useAccountScenarios = ({
  enableFetch = false,
  acconutId,
}: UseAuthProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: accountScenariosDataTable } = useQuery<LeadScenarios[]>({
    queryKey: ["account-scenarios"],
    queryFn: async () => {
      const response = await protectedAxiosInstance.get(
        `/auth/account-scenarios`
      );
      return response.data;
    },
    retry: true,
    staleTime: 1000 * 60 * 5,
    enabled: enableFetch,
  });

  const deleteLeadScenarious = useMutation({
    mutationFn: async (payload: { id: string }) => {
      const response = await protectedAxiosInstance.delete(
        `/auth/account-scenarios/${payload.id}`
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Lead Scenario was deleted");
      queryClient.invalidateQueries({ queryKey: ["account-scenarios"] });
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
        `/auth/account-scenarios/`,
        payload
      );
      return response.data;
    },
    onSuccess: (data: LeadScenarios) => {
      toast.success("Lead Scenario was created");
      queryClient.invalidateQueries({ queryKey: ["account-scenarios"] });
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

  return {
    accountScenariosDataTable,
    // postLeadScenarious: postLeadScenarious.mutate,
    // deleteLeadScenarious: deleteLeadScenarious.mutate,
  };
};
