import { protectedAxiosInstance } from "@/api/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export const useConnectHubspot = () => {
  return useMutation({
    mutationFn: async () => {
      const res = await protectedAxiosInstance.get<{ url: string }>(
        "/auth/hubspot/connect"
      );
      return res.data;
    },
    onSuccess: (data) => {
      if (data.url && typeof window !== "undefined") {
        window.open(data.url, "_blank");
      }
    },
  });
};
