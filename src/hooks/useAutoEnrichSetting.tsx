import { protectedAxiosInstance } from "@/api/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";

interface APIRequestErrorPayload {
  message: string;
  statusCode: number;
}

interface UpdateAutoEnrichPayload {
  isAutoSync: boolean;
}

export const useAutoEnrichSetting = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ isAutoSync }: UpdateAutoEnrichPayload) => {
      const response = await protectedAxiosInstance.patch(
        `/auth/hubspot/auto-sync`,
        {
          isAutoSync,
        }
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
