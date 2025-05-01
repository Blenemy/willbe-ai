import { useMutation, useQueryClient } from "@tanstack/react-query";
import { protectedAxiosInstance } from "@/api/axiosInstance";
import { MessageEntry } from "./useMessageCampaignEntries";
import { toast } from "sonner";

interface CreateMessageEntryDto {
  messageScenarioId: string;
  type: string;
  sendDate?: string;
  sendNow?: boolean;
}

export const useCreateMessageEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateMessageEntryDto) => {
      const res = await protectedAxiosInstance.post<MessageEntry>(
        "/auth/message-campaign-entries",
        {
          messageScenarioId: data.messageScenarioId,
          type: data.type,
          sendDate: data.sendDate,
          sendNow: data.sendNow ?? true,
        }
      );
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["message-campaign-entries", variables.messageScenarioId],
      });
      toast("Message entry was sucessfully created");
    },
    onError: () => {
      toast("Failed to create a message entry");
    },
  });
};

interface UpdateMessageEntryDto {
  id: string;
  type: string;
  sendDate?: string;
  sendNow?: boolean;
  messageScenarioId: string;
}

export const useUpdateMessageEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      type,
      sendDate,
      sendNow,
    }: UpdateMessageEntryDto) => {
      const nowISO = new Date().toISOString();

      const res = await protectedAxiosInstance.patch<MessageEntry>(
        `/auth/message-campaign-entries/${id}`,
        {
          type,
          sendNow: !!sendNow,
          sendDate: sendNow ? nowISO : sendDate,
        }
      );
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["message-campaign-entries", variables.messageScenarioId],
      });
      toast("Message entry was successfully updated");
    },
    onError: () => {
      toast("Failed to update a message entry");
    },
  });
};

interface DeleteMessageEntryDto {
  id: string;
  messageScenarioId: string;
}

export const useDeleteMessageEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: DeleteMessageEntryDto) => {
      await protectedAxiosInstance.delete(
        `/auth/message-campaign-entries/${id}`
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["message-campaign-entries", variables.messageScenarioId],
      });
      toast("Message entry was sucessfully deleted");
    },
    onError: () => {
      toast("Failed to delete a message entry");
    },
  });
};
