import { useQuery } from "@tanstack/react-query";
import { protectedAxiosInstance } from "@/api/axiosInstance";

export const useStatisticsCsv = (
  scenarioId?: string | null,
  onlyEmails = false
) => {
  return useQuery({
    queryKey: ["scenario-csv", scenarioId, onlyEmails],
    enabled: false,
    queryFn: async () => {
      if (!scenarioId) throw new Error("No scenario ID provided");

      const response = await protectedAxiosInstance.get(
        `/auth/message-scenarios/${scenarioId}/csv`,
        {
          params: onlyEmails ? { only_emails: true } : undefined,
          responseType: "blob",
          headers: {
            Accept: "text/csv",
          },
        }
      );

      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);

      return url;
    },
  });
};
