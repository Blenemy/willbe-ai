import { protectedAxiosInstance } from "@/api/axiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

interface APIRequestErrorPayload {
  error: string;
  message: string;
  statusCode: number;
}

export interface MessageScenario {
  id: string;
  title: string;
  leads: number;
  sent: number;
  responseRate: number;
  meetingRate: number;
  status: "not_started" | "in_progress" | "done";
  createdBy: string;
  createdAt: string;
  avatar?: string;
}

export const useMessageScenarios = ({
  enableFetch = true,
}: {
  enableFetch: boolean;
}) => {
  const queryClient = useQueryClient();

  const { data: messageScenarios, isLoading } = useQuery<
    MessageScenario[],
    AxiosError<APIRequestErrorPayload>
  >({
    queryKey: ["message-scenarios"],
    queryFn: async () => {
      const res = await protectedAxiosInstance.get("/auth/message-scenarios");
      return res.data;
    },
    enabled: enableFetch,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const createMessageScenario = useMutation<
    MessageScenario,
    AxiosError<APIRequestErrorPayload>,
    Partial<MessageScenario>
  >({
    mutationFn: async (newScenario) => {
      const res = await protectedAxiosInstance.post(
        "/auth/message-scenarios",
        newScenario
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["message-scenarios"] });
      toast.success("Message scenario created successfully");
    },
    onError: (error) => {
      toast.error(
        error.response?.data.message || "Failed to create message scenario"
      );
    },
  });

  // const fetchMessageScenarioById = (id: string) =>
  //   useQuery<MessageScenario, AxiosError<APIRequestErrorPayload>>({
  //     queryKey: ["message-scenario", id],
  //     queryFn: async () => {
  //       const res = await protectedAxiosInstance.get(`/auth/message-scenarios/${id}`);
  //       return res.data;
  //     },
  //     enabled: !!id,
  //     retry: false,
  //   });

  return {
    messageScenarios,
    isLoading,
    createMessageScenario: createMessageScenario.mutate,
    // fetchMessageScenarioById,
  };
};
