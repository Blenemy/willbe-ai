import { protectedAxiosInstance } from "@/api/axiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface User {
  firstName: string;
  lastName: string;
}

interface Scenario {
  id: string;
  name: string;
  status: string;
  user: User;
  leadsInCadence: number;
  messagesSent: number;
  createdAt: string;
  updatedAt: string;
}

interface GetScenariosParams {
  name?: string;
  limit?: number;
  offset?: number;
}

export const useMessageScenarios = (params: GetScenariosParams = {}) => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ([_, value]) => value !== undefined && value !== ""
    )
  );

  return useQuery({
    queryKey: ["message-scenarios", cleanParams],
    queryFn: async () => {
      const response = await protectedAxiosInstance.get<Scenario[]>(
        "/auth/message-scenarios",
        {
          params: cleanParams,
        }
      );
      return response.data;
    },
  });
};

interface CreateScenarioPayload {
  name: string;
}

export const useCreateMessageScenario = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: CreateScenarioPayload) => {
      const res = await protectedAxiosInstance.post(
        "/auth/message-scenarios",
        data
      );
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["message-scenarios"] });
      router.push(`/dashboard/create-message-scenario/${data.id}`);
      toast("Message scenario was sucessfully created");
    },
    onError: () => {
      toast("Failed to create a message scenario");
    },
  });
};

interface UpdateScenarioPayload extends CreateScenarioPayload {
  id: string;
}

export const useUpdateMessageScenario = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateScenarioPayload) => {
      const res = await protectedAxiosInstance.patch(
        `/auth/message-scenarios/${data.id}`,
        data
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["message-scenarios"] });
      toast("Message scenario was sucessfully updated");
    },
    onError: () => {
      toast("Failed to update a message scenario");
    },
  });
};

export const useMessageScenarioById = (id?: string) => {
  return useQuery({
    queryKey: ["message-scenario", id],
    queryFn: async () => {
      const response = await protectedAxiosInstance.get<Scenario>(
        `/auth/message-scenarios/${id}`
      );
      return response.data;
    },
    enabled: !!id,
  });
};

interface PostLeadsToMessageScenarios {
  id: string;
  leadsIds: string[];
}

export const usePostMessageScenarioLeads = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PostLeadsToMessageScenarios) => {
      const payload = { leadsIds: data.leadsIds };
      const res = await protectedAxiosInstance.post(
        `/auth/message-scenarios/${data.id}/add-leads`,
        payload
      );
      return res.data;
    },
    onSuccess: () => {
      toast("Leads was sucessfully added to a message scenario");
      queryClient.invalidateQueries({ queryKey: ["message-campaign-entry"] });
    },
    onError: () => {
      toast("Failed to add leads to a message scenario");
    },
  });
};

export const useDeleteMessageScenarios = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      await protectedAxiosInstance.delete("/auth/message-scenarios", {
        data: {
          messageScenariosIds: ids,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["message-scenarios"] });
      toast("Message scenario(s) deleted successfully");
    },
    onError: () => {
      toast("Failed to delete message scenario(s)");
    },
  });
};
