import { protectedAxiosInstance } from "@/api/axiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useAuth } from "./useAuth";
import { EmailSignature } from "@/types/EmailSignature";

interface APIRequestErrorPayload {
  error: string;
  message: string;
  statusCode: number;
}

interface UseAuthProps {
  enableFetch: boolean;
}

export const useSignature = ({ enableFetch }: UseAuthProps) => {
  const { user } = useAuth({ enableFetch: false });
  const queryClient = useQueryClient();

  const { data: signature, isLoading } = useQuery<
    EmailSignature,
    AxiosError<APIRequestErrorPayload>
  >({
    queryKey: ["user-signature"],
    queryFn: async () => {
      const response = await protectedAxiosInstance.get(
        `/auth/users/${user.id}/email-signature`
      );
      return response.data;
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
    enabled: enableFetch,
  });

  const updateUserSignature = useMutation({
    mutationFn: async (data: { body: string }) => {
      const response = await protectedAxiosInstance.put(
        `auth/users/${user.id}/email-signature`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-signature"] });
      toast("Signature was updated succesfully");
    },
    onError: (error: AxiosError<APIRequestErrorPayload>) => {
      const errorMessage =
        error.response?.data.message ||
        "Failed to update user signature password";
      toast(errorMessage);
    },
  });

  return {
    signature,
    updateUserSignature: updateUserSignature.mutate,
    isLoading,
  };
};
