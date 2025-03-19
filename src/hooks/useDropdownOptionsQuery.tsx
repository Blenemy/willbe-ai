import { protectedAxiosInstance } from "@/api/axiosInstance";
import { useQuery } from "@tanstack/react-query";

export const useDropdownOptionsQuery = () => {
  return useQuery({
    queryKey: ["dropdown-options"],
    queryFn: async () => {
      const response = await protectedAxiosInstance.get(
        `/auth/scenario-params/dropdowns`
      );
      return response.data;
    },
    staleTime: 1000 * 60 * 10,
  });
};

export const useLanguagesQuery = () => {
  return useQuery({
    queryKey: ["languages"],
    queryFn: async () => {
      const response = await protectedAxiosInstance.get(
        `/auth/scenario-params/languages`
      );
      return response.data;
    },
    staleTime: 1000 * 60 * 10,
  });
};
