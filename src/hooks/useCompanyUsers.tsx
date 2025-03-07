import { protectedAxiosInstance } from "@/api/axiosInstance";
import { User } from "@/types/User";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { AxiosError } from "axios";
import { toast } from "sonner";

interface CreateCompanyUsersPayload {
  email: string;
  role: string;
  position: string;
}

interface UpdateCompanyUsersPayload {
  userId: string;
  role: string;
  position: string;
}

interface APIRequestErrorPayload {
  message: string;
  statusCode: number;
}

interface UseAuthProps {
  enableFetch: boolean;
}

export const useCompanyUsers = ({ enableFetch = false }: UseAuthProps) => {
  const queryClient = useQueryClient();

  const { user } = useAuth({ enableFetch: false });

  const { data: companyUsers, isLoading } = useQuery<User[]>({
    queryKey: ["company-users", user?.companyId],
    queryFn: async () => {
      const response = await protectedAxiosInstance.get(
        `/auth/company-users/${user.companyId}`
      );
      return response.data;
    },
    retry: true,
    staleTime: 1000 * 60 * 5,
    enabled: enableFetch && !!user?.companyId,
  });

  const createCompanyUsersMutation = useMutation({
    mutationFn: async (data: CreateCompanyUsersPayload) => {
      const response = await protectedAxiosInstance.post(
        `/auth/company-users/${user.companyId}/invitations`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["company-users", user?.companyId],
      });
      toast("Invitation was succesfully sent");
    },
    onError: (error: AxiosError<APIRequestErrorPayload>) => {
      const errorMessage = error.response?.data.message || "Invitation failed.";
      toast(errorMessage);
    },
  });

  const updateCompanyUsersMutation = useMutation({
    mutationFn: async (data: UpdateCompanyUsersPayload) => {
      const response = await protectedAxiosInstance.patch(
        `/auth/company-users/${data.userId}/`,
        { role: data.role, position: data.position }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["company-users", user?.companyId],
      });
      toast("User was succesfully updated");
    },
    onError: (error: AxiosError<APIRequestErrorPayload>) => {
      const errorMessage =
        error.response?.data.message || "Update user failed.";
      toast(errorMessage);
    },
  });

  const deleteCompanyUsersMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await protectedAxiosInstance.delete(
        `/auth/company-users/${userId}/`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["company-users", user?.companyId],
      });
      toast("User was succesfully deleted");
    },
    onError: (error: AxiosError<APIRequestErrorPayload>) => {
      const errorMessage =
        error.response?.data.message || "Failed to delete the user";
      toast(errorMessage);
    },
  });

  return {
    companyUsers,
    createCompanyUsers: createCompanyUsersMutation.mutate,
    updateCompanyUsers: updateCompanyUsersMutation.mutate,
    deleteCompanyUser: deleteCompanyUsersMutation.mutate,
    isLoading,
  };
};
