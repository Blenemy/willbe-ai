import { protectedAxiosInstance } from "@/api/axiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { SavedLead } from "@/types/SavedLead";
import { APIRequestErrorPayload } from "@/types/ApiError";


interface UseAuthProps {
  enableFetch: boolean;
  scenarioId?: string | null;
}

export interface SaveLeadPayload {
  type: string;
  id: string;
  industry: string | null;
  name: string;
  first_name: string;
  last_name: string;
  member_urn: string;
  public_identifier: string;
  public_profile_url: string;
  profile_url: string;
  profile_picture_url: string;
  profile_picture_url_large: string;
  network_distance: string;
  location: string;
  headline: string;
  summary: string;
  pending_invitation: boolean;
  current_positions: {
    company: string;
    company_id: string;
    location: string;
    industry: string[];
    role?: string;
  }[];
}

interface SaveLeadsPayload {
  scenarioId: string;
  leads: SaveLeadPayload[];
}

export const useSavedLeads = ({ enableFetch, scenarioId }: UseAuthProps) => {
  const queryClient = useQueryClient();

  const { data: savedLeads } = useQuery<
    SavedLead[],
    AxiosError<APIRequestErrorPayload>
  >({
    queryKey: ["leads-saved"],
    queryFn: async () => {
      const res = await protectedAxiosInstance.get(
        `/auth/lead-scenarios/${scenarioId}/saved-leads`
      );
      return res.data;
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
    enabled: enableFetch,
  });

  const deleteLead = useMutation({
    mutationFn: async (id: string) => {
      const response = await protectedAxiosInstance.delete(
        `/auth/lead-scenarios/saved-leads/${id}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads-saved"] });
      toast("Lead was deleted successfully");
    },
    onError: (error: AxiosError<APIRequestErrorPayload>) => {
      const errorMessage =
        error.response?.data.message || "Failed to delete saved lead";
      toast(errorMessage);
    },
  });

  const saveSelectedLeads = useMutation({
    mutationFn: async ({ scenarioId, leads }: SaveLeadsPayload) => {
      return await protectedAxiosInstance.post(
        `/auth/lead-scenarios/${scenarioId}/leads`,
        { leads }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads-saved"] });
      toast.success("Selected leads saved successfully");
    },
    onError: (error: AxiosError) => {
      console.error(error);
      toast.error("Failed to save selected leads");
    },
  });

  return {
    savedLeads,
    saveSelectedLeads: saveSelectedLeads.mutateAsync,
    deleteLead: deleteLead.mutate,
  };
};
