import { protectedAxiosInstance } from "@/api/axiosInstance";
import { AccountScenarioDropdowns } from "@/types/AccountDropdowns";
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

export const useAccountScenariosDropdowns = () => {
  return useQuery<AccountScenarioDropdowns>({
    queryKey: ["account-dropdown-options"],
    queryFn: async () => {
      const response = await protectedAxiosInstance.get(
        `/auth/account-scenarios-params/dropdowns`
      );
      return response.data;
    },
    staleTime: 1000 * 60 * 10,
  });
};
