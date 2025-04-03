import { useQuery } from "@tanstack/react-query";
import { protectedAxiosInstance } from "@/api/axiosInstance";

export const useMessageStructureById = (id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["message-structure", id],
    queryFn: async () => {
      const response = await protectedAxiosInstance.get(
        `/auth/message-structures/${id}`
      );
      return response.data;
    },
    retry: false,
  });

  return {
    structure: data,
    isLoading,
    error,
  };
};
