import { axiosInstance, protectedAxiosInstance } from "@/api/axiosInstance";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import Cookies from "js-cookie";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}

interface UseAuthProps {
  enableFetch: boolean;
}

export const useAuth = ({ enableFetch = false }: UseAuthProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const locale = useLocale();

  const { data: user, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const response = await protectedAxiosInstance.get("/auth/me");
      return response.data;
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
    enabled: enableFetch,
  });

  const handleAuthSuccess = async (data: {
    accessToken: string;
    refreshToken: string;
  }) => {
    Cookies.set("accessToken", data.accessToken, {
      secure: true,
      sameSite: "Strict",
    });
    Cookies.set("refreshToken", data.refreshToken, {
      secure: true,
      sameSite: "Strict",
    });

    try {
      const response = await protectedAxiosInstance.get("/auth/me");
      queryClient.setQueryData(["authUser"], response.data);
    } catch (error) {
      console.error("Error fetching a user:", error);
    }

    router.push("/dashboard/home");
  };

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginPayload) => {
      const response = await axiosInstance.post("/auth/login", credentials);
      return response.data;
    },
    onSuccess: handleAuthSuccess,
  });

  const logout = () => {
    queryClient.setQueryData(["authUser"], null);
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    router.replace(`/${locale}/sign-in`);
  };

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterPayload) => {
      const response = await axiosInstance.post("/auth/registration", data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["authUser"], data);
      router.push("/dashboard/home");
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: async (email: string) => {
      await axiosInstance.post(`/auth/forgot-password?email=${email}`);
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: ResetPasswordPayload) => {
      await axiosInstance.post("/auth/reset-password", data);
    },
    onSuccess: () => {
      router.replace(`/${locale}/sign-in`);
    },
  });

  const validateResetTokenQuery = useMutation({
    mutationFn: async (token: string) => {
      const response = await axiosInstance.get(
        `/auth/reset-password?token=${token}`
      );
      return response.data;
    },
  });

  const refreshTokensMutation = useMutation({
    mutationFn: async () => {
      const refreshToken = Cookies.get("refreshToken");
      if (!refreshToken) throw new Error("No refresh token found");

      const response = await axiosInstance.post("/auth/refresh-tokens", {
        refreshToken,
      });
      Cookies.set("accessToken", response.data.accessToken, {
        secure: true,
        sameSite: "Strict",
      });
      return response.data;
    },
  });

  return {
    user,
    isLoading,
    login: loginMutation.mutate,
    logout,
    register: registerMutation.mutate,
    refreshTokens: refreshTokensMutation.mutate,
    forgotPassword: forgotPasswordMutation.mutate,
    resetPassword: resetPasswordMutation.mutate,
    validateResetToken: validateResetTokenQuery.mutate,
  };
};
