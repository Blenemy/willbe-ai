import { useMutation, useQueryClient } from "@tanstack/react-query";
import { protectedAxiosInstance } from "@/api/axiosInstance";
import { toast } from "sonner";
import { MessageEntry } from "./useMessageCampaignEntries";
import { AxiosError } from "axios";

interface SearchLanguageDto {
  messageEntryLeadDataId: string;
}

export const useSearchLanguage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ messageEntryLeadDataId }: SearchLanguageDto) => {
      const res = await protectedAxiosInstance.post<MessageEntry>(
        `/auth/message-campaign-entries/search-language`,
        null,
        {
          params: {
            messageEntryLeadDataId,
          },
        }
      );

      return res.data;
    },
    onSuccess: (data) => {
      toast.success("Language successfully determined");

      queryClient.setQueryData<MessageEntry>(
        ["message-campaign-entry", data.id],
        data
      );

      queryClient.invalidateQueries({
        queryKey: ["message-campaign-entries"],
      });

      queryClient.invalidateQueries({
        queryKey: ["leads-in-cadence"],
      });
    },
    onError: (err) => {
      const axiosError = err as AxiosError<{
        message?: string;
      }>;

      const message = axiosError.response?.data?.message ?? axiosError.message;

      toast.error(message);
    },
  });
};
