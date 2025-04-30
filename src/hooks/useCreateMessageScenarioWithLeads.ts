import { useMutation } from "@tanstack/react-query";
import { protectedAxiosInstance } from "@/api/axiosInstance";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { toast } from "sonner";

interface CreateMessageScenarioInput {
  leadScenarioId: string;
  leadsIds: string[];
}

export const useCreateMessageScenarioWithLeads = () => {
  const router = useRouter();
  const locale = useLocale();

  const mutation = useMutation({
    mutationFn: async (data: CreateMessageScenarioInput) => {
      const response = await protectedAxiosInstance.post(
        "/auth/message-scenarios/create-with-leads",
        data
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Message scenario created!");
      router.replace(`/${locale}/dashboard/create-message-scenario/${data.id}`);
    },
    onError: () => {
      toast.error("Failed to create message scenario");
    },
  });

  return {
    createMessageScenario: mutation.mutate,
    error: mutation.error,
  };
};
