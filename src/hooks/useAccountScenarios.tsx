import { protectedAxiosInstance } from "@/api/axiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AccountScenario } from "@/types/AccountScenario";
import { AccountSearch } from "@/types/AccountSearch";

interface APIRequestErrorPayload {
  message: string;
  statusCode: number;
}

interface UseAccountProps {
  enableFetch: boolean;
  accountId?: string | null;
}

export const useAccountScenarios = ({
  enableFetch = false,
  accountId,
}: UseAccountProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: accountScenariosDataTable } = useQuery<AccountScenario[]>({
    queryKey: ["account-scenarios"],
    queryFn: async () => {
      const response = await protectedAxiosInstance.get(
        `/auth/account-scenarios`
      );
      return response.data;
    },
    retry: true,
    staleTime: 1000 * 60 * 5,
    enabled: enableFetch,
  });

  const { data: accountScenarioById } = useQuery<AccountScenario>({
    queryKey: ["account-scenario-by-id"],
    queryFn: async () => {
      const response = await protectedAxiosInstance.get(
        `/auth/account-scenarios/${accountId}`
      );
      return response.data;
    },
    retry: true,
    staleTime: 1000 * 60 * 5,
    enabled: !!accountId,
  });

  const { data: accountsSearchData } = useQuery<AccountSearch[]>({
    queryKey: ["account-search"],
    queryFn: async () => {
      const response = await protectedAxiosInstance.get(
        `/auth/account-scenarios/${accountId}/accounts`
      );
      return response.data.items;
    },
    retry: true,
    staleTime: 1000 * 60 * 5,
    enabled: !!accountId && enableFetch,
  });

  const deleteAccountScenario = useMutation({
    mutationFn: async (payload: { id: string }) => {
      const response = await protectedAxiosInstance.delete(
        `/auth/account-scenarios/${payload.id}`
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Account Scenario was deleted");
      queryClient.invalidateQueries({ queryKey: ["account-scenarios"] });
    },
    onError: (error: AxiosError<APIRequestErrorPayload>) => {
      toast.error(
        error.response?.data.message || "Failure to delete an account scenario"
      );
    },
  });

  const createAccountScenario = useMutation({
    mutationFn: async (payload: { name: string }) => {
      const response = await protectedAxiosInstance.post(
        `/auth/account-scenarios/`,
        payload
      );
      return response.data;
    },
    onSuccess: (data: AccountScenario) => {
      toast.success("Account Scenario was created");
      queryClient.invalidateQueries({ queryKey: ["account-scenarios"] });
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set("accountId", data.id.toString());
      currentUrl.searchParams.set("accountName", data.name.toString());

      router.push(currentUrl.toString(), undefined);
    },
    onError: (error: AxiosError<APIRequestErrorPayload>) => {
      toast.error(
        error.response?.data.message || "Failure to create an account scenario"
      );
    },
  });

  const updateAccountScenario = useMutation({
    mutationFn: async ({
      accountId,
      payload,
    }: {
      accountId: string;
      payload: { name: string; filterValues?: never[] };
    }) => {
      const response = await protectedAxiosInstance.patch(
        `/auth/account-scenarios/${accountId}`,
        payload
      );
      return response.data;
    },
    onSuccess: (data: AccountScenario) => {
      toast.success("Account Scenario was updated");
      queryClient.invalidateQueries({ queryKey: ["account-scenarios"] });
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set("accountId", data.id.toString());
      currentUrl.searchParams.set("accountName", data.name.toString());

      router.push(currentUrl.toString(), undefined);
    },
    onError: (error: AxiosError<APIRequestErrorPayload>) => {
      toast.error(
        error.response?.data.message || "Failure to update an account scenario"
      );
    },
  });

  return {
    accountsSearchData,
    accountScenariosDataTable,
    accountScenarioById,
    createAccountScenario: createAccountScenario.mutate,
    deleteAccountScenario: deleteAccountScenario.mutate,
    updateAccountScenario: updateAccountScenario.mutate,
  };
};
