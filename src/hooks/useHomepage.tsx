import { protectedAxiosInstance } from "@/api/axiosInstance";
import { useQuery } from "@tanstack/react-query";

interface Meeting {
  messageScenarioId: string;
  leadName: string;
  leadProfilePictureUrl: string;
  position: string;
  accountName: string;
  accountUrl: string;
}

interface UseMeetingsProps {
  enableFetch: boolean;
  daysInterval?: number;
  limit?: number;
  offset?: number;
}

export const useMeetings = ({
  daysInterval,
  limit,
  offset,
}: UseMeetingsProps) => {
  const queryKey = ["meetings", { daysInterval, limit, offset }];

  const { data, isLoading, error, refetch } = useQuery<Meeting[]>({
    queryKey,
    queryFn: async () => {
      const response = await protectedAxiosInstance.get("/auth/home/meetings", {
        params: {
          daysInterval,
          limit,
          offset,
        },
      });
      return response.data;
    },
  });

  return {
    meetings: data,
    isLoading,
    error,
    refetch,
  };
};

interface MeetingsResponseRate {
  responseRate: string;
  meetingRate: string;
}

interface UseMeetingsResponseRateProps {
  enableFetch: boolean;
  daysInterval?: number;
}

export const useMeetingsResponseRate = ({
  daysInterval,
}: UseMeetingsResponseRateProps) => {
  const { data, isLoading, error, refetch } = useQuery<MeetingsResponseRate>({
    queryKey: ["meetings-response-rate", daysInterval],
    retry: false,
    queryFn: async () => {
      const response = await protectedAxiosInstance.get(
        "/auth/home/meetings-responses-rate",
        {
          params: { daysInterval },
        }
      );
      return response.data;
    },
  });

  return {
    responseRate: data?.responseRate ?? null,
    meetingRate: data?.meetingRate ?? null,
    isLoading,
    error,
    refetch,
  };
};

interface ScenarioPerformance {
  account: number;
  lead: number;
  meetings: number;
  responses: number;
  outOfOffice: number;
  bounced: number;
  meetingsEmail: number;
  meetingsLinkedin: number;
  responsesEmail: number;
  responsesLinkedin: number;
}

interface UseScenarioPerformanceProps {
  enableFetch: boolean;
  daysInterval?: number;
}

export const useScenarioPerformance = ({
  daysInterval,
}: UseScenarioPerformanceProps) => {
  const { data, isLoading, error, refetch } = useQuery<ScenarioPerformance>({
    queryKey: ["scenario-performance", daysInterval],
    retry: false,
    queryFn: async () => {
      const response = await protectedAxiosInstance.get(
        "/auth/home/scenario-performance",
        {
          params: { daysInterval },
        }
      );
      return response.data;
    },
  });

  return {
    performance: data,
    isLoading,
    error,
    refetch,
  };
};
