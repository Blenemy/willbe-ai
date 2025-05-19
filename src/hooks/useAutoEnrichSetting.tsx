import { axiosInstance } from "@/api/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";

interface APIRequestErrorPayload {
  message: string;
  statusCode: number;
}

interface UpdateAutoEnrichPayload {
  companyId: string;
  auto_enrich: boolean;
}

export const useAutoEnrichSetting = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ companyId, auto_enrich }: UpdateAutoEnrichPayload) => {
      const response = await axiosInstance.post(
        `/hubspot/enrich-settings/${companyId}`,
        { auto_enrich }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Auto enrich setting updated");
      queryClient.invalidateQueries({ queryKey: ["hubspot-enrich-setting"] });
    },
    onError: (error: AxiosError<APIRequestErrorPayload>) => {
      toast.error(error.response?.data.message || "Failed to update setting");
    },
  });

  return {
    updateAutoEnrich: mutation.mutate,
    isPending: mutation.isPending,
  };
};
