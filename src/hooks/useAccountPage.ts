import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { protectedAxiosInstance } from "@/api/axiosInstance";

interface AccountPageInterface {
  companyTitle: string;
  description: string;
  employees: string;
  foundedIn: null | string;
  headquarters: null | string;
  id: string;
  industry: string;
  isConnectedToHubspot: boolean;
  linkedin: string;
  logo: string;
  website: string;
}

export const useAccount = (id: string) => {
  const queryClient = useQueryClient();

  const { data: account, isLoading } = useQuery<AccountPageInterface>({
    queryKey: ["account", id],
    queryFn: async () => {
      const res = await protectedAxiosInstance.get(`/auth/accounts/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  const updateAccount = useMutation({
    mutationFn: async (data: Partial<typeof account>) => {
      const res = await protectedAxiosInstance.patch(
        `/auth/accounts/${id}`,
        data
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account", id] });
    },
  });

  return {
    account,
    isLoading,
    updateAccount: updateAccount.mutate,
  };
};
