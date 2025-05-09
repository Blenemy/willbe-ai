import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { protectedAxiosInstance } from "@/api/axiosInstance";
import { toast } from "sonner";

export interface LeadDetails {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  positionDescription: string;
  email: string;
  phone: string;
  company: string;
  industry: string;
  language: string;
  locationCountry: string;
  locationCity: string;
  subtitle: string;
  summary: string;
  linkedin: string;
  isConnectedToHubspot: boolean;
}

export const useLeadsPage = (id?: string) => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<LeadDetails>({
    queryKey: ["lead", id],
    queryFn: async () => {
      const res = await protectedAxiosInstance.get(`/auth/leads/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  const updateLead = useMutation({
    mutationFn: async (payload: Partial<LeadDetails>) => {
      const res = await protectedAxiosInstance.patch(
        `/auth/leads/${id}`,
        payload
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Lead updated successfully");
      queryClient.invalidateQueries({ queryKey: ["lead", id] });
    },
    onError: (err) => {
      toast.error("Failed to update lead: " + err.message);
    },
  });

  return {
    data,
    isLoading,
    updateLead: updateLead.mutate,
    isUpdating: updateLead.isPending,
  };
};
