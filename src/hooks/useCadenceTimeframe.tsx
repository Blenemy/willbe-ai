import { useQuery } from "@tanstack/react-query";
import { protectedAxiosInstance } from "@/api/axiosInstance";

export interface CadenceTimeframeItem {
  id: string;
  cadenceType: string;
  structure: string;
  mailsSent: number;
  meetingRate: number;
  responseRate: number;
  outOfOfficeRate: number;
  bounceRate: number;
  dateToBeSent: string;
  isSent: boolean;
}

export const useCadenceTimeframe = (scenarioId?: string) => {
  return useQuery({
    queryKey: ["cadence-timeframe", scenarioId],
    queryFn: async () => {
      const res = await protectedAxiosInstance.get<CadenceTimeframeItem[]>(
        `/auth/message-scenarios/${scenarioId}/cadence-timeframe`
      );
      return res.data;
    },
    enabled: !!scenarioId,
  });
};
