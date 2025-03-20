import { axiosInstance } from "@/api/axiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { Invitation } from "@/types/Company";
import { useRouter } from "next/navigation";

interface APIRequestErrorPayload {
  message: string;
  statusCode: number;
}

interface UseAuthProps {
  enableFetch: boolean;
  invitationId: string | null;
}

export const useInvitation = ({
  enableFetch = false,
  invitationId,
}: UseAuthProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: invitation } = useQuery<Invitation>({
    queryKey: ["company-invitations"],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/auth/company-users/invitations/${invitationId}`
      );
      return response.data;
    },
    retry: true,
    staleTime: 1000 * 60 * 5,
    enabled: enableFetch,
  });

  const acceptInvitationMutation = useMutation({
    mutationFn: async (payload: {
      firstName: string;
      lastName: string;
      password: string;
    }) => {
      const response = await axiosInstance.post(
        `/auth/company-users/invitations/${invitationId}`,
        payload
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Invite was accepted");
      queryClient.invalidateQueries({ queryKey: ["company-invitations"] });

      router.replace(`/sign-in`);
    },
    onError: (error: AxiosError<APIRequestErrorPayload>) => {
      toast.error(
        error.response?.data.message || "Failure to accept the invite"
      );
    },
  });

  return {
    invitation,
    acceptInvitation: acceptInvitationMutation.mutate,
  };
};
