import { useMutation, useQueryClient } from "@tanstack/react-query";
import { protectedAxiosInstance } from "@/api/axiosInstance";
import { toast } from "sonner";
import { handleAxiosError } from "@/utils/handleAxiosError/handleAxiosError";

interface GenerateMessagesDto {
  messageEntryDataIds: string[];
}

export const useGenerateMessages = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: GenerateMessagesDto) => {
      const res = await protectedAxiosInstance.post(
        "/auth/message-campaign-entries/generate-messages",
        data
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Messages successfully generated.");
      queryClient.invalidateQueries({
        queryKey: ["message-campaign-entry"],
      });
      queryClient.invalidateQueries({
        queryKey: ["message-campaign-entries"],
      });
    },
    onError: (err) => {
      handleAxiosError(err, "Failed to generate messages.");
    },
  });
};

export const useSendMessages = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: GenerateMessagesDto) => {
      const res = await protectedAxiosInstance.post(
        "/auth/message-campaign-entries/send-messages",
        data
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Messages were successfully sent.");
      queryClient.invalidateQueries({
        queryKey: ["message-campaign-entry"],
      });
      queryClient.invalidateQueries({
        queryKey: ["message-scenario"],
      });
      queryClient.invalidateQueries({
        queryKey: ["message-campaign-entries"],
      });
    },
    onError: (err) => {
      handleAxiosError(err);
    },
  });
};
