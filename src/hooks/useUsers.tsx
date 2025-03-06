import { protectedAxiosInstance } from "@/api/axiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface UseAuthProps {
  enableFetch: boolean;
}

export const useUsers = ({ enableFetch = false }: UseAuthProps) => {
  const queryClient = useQueryClient();

  const { data: users } = useQuery<Company>({
    queryKey: ["company"],
    queryFn: async () => {
      const response = await protectedAxiosInstance.get(
        `/auth/companies/${user.companyId}`
      );
      return response.data;
    },
    retry: true,
    staleTime: 1000 * 60 * 5,
    enabled: enableFetch,
  });

  // const updateCompanyMutation = useMutation({
  //   mutationFn: async (data: UpdateCompantProps) => {
  //     const response = await protectedAxiosInstance.patch(
  //       `/auth/companies/${user.companyId}`,
  //       data
  //     );
  //     return response.data;
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["company"] });
  //   },
  // });

  return {};
};
