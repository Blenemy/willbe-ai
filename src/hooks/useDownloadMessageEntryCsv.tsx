import { useQuery } from "@tanstack/react-query";
import { protectedAxiosInstance } from "@/api/axiosInstance";

export const useDownloadMessageEntryCsv = (
  id?: string | null,
  withEmails = false
) => {
  return useQuery({
    queryKey: ["message-entry-csv", id, withEmails],
    enabled: !!id,
    queryFn: async () => {
      const response = await protectedAxiosInstance.get(
        `/auth/message-campaign-entries/${id}/csv`,
        {
          params: { withEmails },
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);

      return url;
    },
  });
};
