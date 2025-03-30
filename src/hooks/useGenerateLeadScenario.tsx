import { protectedAxiosInstance } from "@/api/axiosInstance";
import { LeadScenarios } from "@/types/LeadScenarios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface APIRequestErrorPayload {
  error: string;
  message: string;
  statusCode: number;
}

interface GenerateLeadScenarioInput {
  accountScenarioId: string | null;
  accountIds: string[];
}

export const useGenerateLeadScenario = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const locale = useLocale();

  const mutation = useMutation({
    mutationFn: async (data: GenerateLeadScenarioInput) => {
      const response = await protectedAxiosInstance.post(
        "/auth/lead-scenarios/create-with-accounts",
        data
      );
      return response.data;
    },
    onSuccess: (data: LeadScenarios) => {
      queryClient.invalidateQueries({ queryKey: ["accounts-saved"] });
      toast.success("Lead scenario generated successfully");

      const newUrl = new URL(
        `/${locale}/dashboard/lead-generation/create-lead-scenarios`,
        window.location.origin
      );
      newUrl.searchParams.set("scenarioId", data.id.toString());
      newUrl.searchParams.set("scenarioName", data.name.toString());
      router.replace(newUrl.toString());
    },
    onError: (error: AxiosError<APIRequestErrorPayload>) => {
      const errorMessage =
        error.response?.data.message || "Failed to generate lead scenario";
      toast.error(errorMessage);
    },
  });

  return {
    generateLeadScenario: mutation.mutate,
    error: mutation.error,
  };
};
