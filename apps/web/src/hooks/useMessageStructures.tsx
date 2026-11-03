import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { protectedAxiosInstance } from "@/api/axiosInstance";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { MessageStructure } from "@/types/MessageStructure";
import { useAuth } from "./useAuth";
import { APIRequestErrorPayload } from "@/types/ApiError";

interface CreateMessageStructurePayload {
  name: string;
  messageType: string;
  subjectType: string;
  wordsLimit: number;
}


export const useMessageStructures = ({
  enableFetch,
}: {
  enableFetch?: boolean;
}) => {
  const queryClient = useQueryClient();
  const { user } = useAuth({ enableFetch: false });

  const { data, isLoading, error } = useQuery<
    MessageStructure[],
    AxiosError<APIRequestErrorPayload>
  >({
    queryKey: ["message-structures", user?.id],
    queryFn: async () => {
      const response = await protectedAxiosInstance.get(
        "/auth/message-structures"
      );
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
    enabled: enableFetch,
  });

  const deleteStructure = useMutation({
    mutationFn: async (id: string) => {
      await protectedAxiosInstance.delete(`/auth/message-structures/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["message-structures"] });
      toast.success("Message structure deleted.");
    },
    onError: (error: AxiosError<APIRequestErrorPayload>) => {
      toast.error(error.response?.data.message || "Failed to delete structure");
    },
  });

  const createStructure = useMutation({
    mutationFn: async (payload: CreateMessageStructurePayload) => {
      const response = await protectedAxiosInstance.post(
        "/auth/message-structures",
        payload
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["message-structures"] });
      toast.success("Message structure created.");
    },
    onError: (error: AxiosError<APIRequestErrorPayload>) => {
      toast.error(error.response?.data.message || "Failed to create structure");
    },
  });

  const copyStructure = useMutation({
    mutationFn: async (id: string) => {
      await protectedAxiosInstance.post(`/auth/message-structures/${id}/clone`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["message-structures"] });
      toast.success("Message structure copied.");
    },
    onError: (error: AxiosError<APIRequestErrorPayload>) => {
      toast.error(error.response?.data.message || "Failed to copy structure");
    },
  });

  return {
    structures: data || [],
    isLoading,
    error,
    deleteStructure: deleteStructure.mutate,
    createStructure: createStructure.mutate,
    copyStructure: copyStructure.mutate,
  };
};
