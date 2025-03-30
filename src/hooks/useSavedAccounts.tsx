import { protectedAxiosInstance } from "@/api/axiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { SavedAccount } from "@/types/SavedAccount";

interface APIRequestErrorPayload {
  error: string;
  message: string;
  statusCode: number;
}

interface UseAuthProps {
  enableFetch: boolean;
  accountId?: string | null;
}

export const useSavedAccounts = ({ enableFetch, accountId }: UseAuthProps) => {
  const queryClient = useQueryClient();

  const { data: savedAccounts } = useQuery<
    SavedAccount[],
    AxiosError<APIRequestErrorPayload>
  >({
    queryKey: ["accounts-saved"],
    queryFn: async () => {
      const res = await protectedAxiosInstance.get(
        `/auth/account-scenarios/${accountId}/saved-accounts`
      );
      return res.data;
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
    enabled: enableFetch,
  });

  const deleteSavedAccounts = useMutation({
    mutationFn: async (id: string) => {
      const response = await protectedAxiosInstance.delete(
        `/auth/account-scenarios/saved-accounts/${id}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts-saved"] });
      toast("Account was deleted succesfully");
    },
    onError: (error: AxiosError<APIRequestErrorPayload>) => {
      const errorMessage =
        error.response?.data.message || "Failed to delete saved account";
      toast(errorMessage);
    },
  });

  return {
    savedAccounts,
    deleteSavedAccounts: deleteSavedAccounts.mutate,
  };
};
