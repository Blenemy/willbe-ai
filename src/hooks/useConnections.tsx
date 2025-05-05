import { protectedAxiosInstance } from "@/api/axiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useAuth } from "./useAuth";

export interface StatusResponse {
  linkedin: boolean;
  email: string;
  hubspot: boolean;
}

interface APIRequestErrorPayload {
  error: string;
  message: string;
  statusCode: number;
}

interface UseAuthProps {
  enableFetch: boolean;
}

export const useConnections = ({ enableFetch }: UseAuthProps) => {
  const { user } = useAuth({ enableFetch: false });

  const queryClient = useQueryClient();

  const { data: userStatus } = useQuery<
    StatusResponse,
    AxiosError<APIRequestErrorPayload>
  >({
    queryKey: ["user-connections"],
    queryFn: async () => {
      const response = await protectedAxiosInstance.get(
        `/auth/users-accounts/${user.id}`
      );
      return response.data;
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
    enabled: enableFetch,
  });

  const connectLinkedIn = useMutation({
    mutationFn: async () => {
      const response = await protectedAxiosInstance.get(
        `/auth/users-accounts/${user.id}/linkedin`
      );
      return response.data;
    },
    onSuccess: (data) => {
      if (data?.url) {
        window.open(data.url, "_blank");
        toast("Redirecting to LinkedIn authentication...");
      }
    },
    onError: (error: AxiosError<APIRequestErrorPayload>) => {
      const errorMessage =
        error.response?.data.message || "Failed to get LinkedIn auth URL";
      toast(errorMessage);
    },
  });

  const disconnectLinkedIn = useMutation({
    mutationFn: async () => {
      await protectedAxiosInstance.delete(
        `/auth/users-accounts/${user.id}/linkedin`
      );
    },
    onSuccess: () => {
      toast("LinkedIn account disconnected successfully.");
      queryClient.invalidateQueries({ queryKey: ["user-connections"] });
    },
    onError: (error: AxiosError<APIRequestErrorPayload>) => {
      const errorMessage =
        error.response?.data.message || "Failed to disconnect LinkedIn";
      toast(errorMessage);
    },
  });

  const connectGmail = useMutation({
    mutationFn: async () => {
      const response = await protectedAxiosInstance.get(
        `/auth/users-accounts/${user.id}/gmail`
      );
      return response.data;
    },
    onSuccess: (data) => {
      if (data?.url) {
        window.open(data.url, "_blank");
        toast("Redirecting to Gmail authentication...");
      }
    },
    onError: (error: AxiosError<APIRequestErrorPayload>) => {
      const errorMessage =
        error.response?.data.message || "Failed to get Gmail auth URL";
      toast(errorMessage);
    },
  });

  const disconnectEmail = useMutation({
    mutationFn: async () => {
      await protectedAxiosInstance.delete(
        `/auth/users-accounts/${user.id}/email`
      );
    },
    onSuccess: () => {
      toast("Email account disconnected successfully.");
      queryClient.invalidateQueries({ queryKey: ["user-connections"] });
    },
    onError: (error: AxiosError<APIRequestErrorPayload>) => {
      const errorMessage =
        error.response?.data.message || "Failed to disconnect email";
      toast(errorMessage);
    },
  });

  const connectOutlook = useMutation({
    mutationFn: async () => {
      const response = await protectedAxiosInstance.get(
        `/auth/users-accounts/${user.id}/outlook`
      );
      return response.data;
    },
    onSuccess: (data) => {
      if (data?.url) {
        window.open(data.url, "_blank");
        toast("Redirecting to Outlook authentication...");
      }
    },
    onError: (error: AxiosError<APIRequestErrorPayload>) => {
      const errorMessage =
        error.response?.data.message || "Failed to get Gmail auth URL";
      toast(errorMessage);
    },
  });

  return {
    userStatus,
    connectLinkedIn,
    disconnectLinkedIn,
    connectGmail,
    disconnectEmail,
    connectOutlook,
  };
};
