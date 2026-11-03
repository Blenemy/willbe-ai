import { protectedAxiosInstance } from "@/api/axiosInstance";
import { useQuery } from "@tanstack/react-query";

interface SearchSelectType {
  object: string;
  title: string;
  id: string;
}

export const useSearchParamsQuery = (type: string, keywords: string) => {
  return useQuery<SearchSelectType[], Error>({
    queryKey: ["searchParams", type, keywords],
    queryFn: async () => {
      if (!type || !keywords) return [];
      const url = `/auth/scenario-params?type=${encodeURIComponent(
        type
      )}&keywords=${encodeURIComponent(keywords)}`;

      const response = await protectedAxiosInstance.get(url);
      return response.data;
    },
    enabled: false,
  });
};
