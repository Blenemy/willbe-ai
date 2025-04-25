import { useQuery } from "@tanstack/react-query";
import { protectedAxiosInstance } from "@/api/axiosInstance";

interface ScenarioStatistics {
  totalSent: number;
  bounced: number;
  replied: number;
  bounceRate: number;
  responseRate: number;
  meetingRate: number;
  outOfOfficeRate: number;
}

export const useScenarioStatistics = (id?: string) => {
  return useQuery({
    queryKey: ["scenario-statistics", id],
    queryFn: async () => {
      const res = await protectedAxiosInstance.get<ScenarioStatistics>(
        `/auth/message-scenarios/${id}/statistics`
      );
      return res.data;
    },
    enabled: !!id,
  });
};
