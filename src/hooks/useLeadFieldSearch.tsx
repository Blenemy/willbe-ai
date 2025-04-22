import { useMutation, useQueryClient } from "@tanstack/react-query";
import { protectedAxiosInstance } from "@/api/axiosInstance";
import { toast } from "sonner";
import { MessageEntry } from "./useMessageCampaignEntries";

type FieldType = "email" | "phone";

interface SearchFieldDto {
  entryIds: string[];
  field: FieldType;
}

export const useSearchLeadField = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ entryIds, field }: SearchFieldDto) => {
      await protectedAxiosInstance.post(
        `/auth/message-campaign-entries/search-${field}`,
        { messageEntryDataIds: entryIds }
      );

      const res = await protectedAxiosInstance.get<MessageEntry>(
        `/auth/message-campaign-entries/${entryIds[0]}/updates`
      );

      return res.data;
    },
    onSuccess: (data) => {
      toast.success("Search completed");

      queryClient.setQueryData<MessageEntry>(
        ["message-campaign-entry", data.id],
        data
      );

      queryClient.invalidateQueries({
        queryKey: ["message-campaign-entries"],
      });
    },
    onError: (err: Error) => {
      toast.error(`Search failed: ${err.message}`);
    },
  });
};
