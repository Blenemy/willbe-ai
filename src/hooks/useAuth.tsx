import { axiosInstance, protectedAxiosInstance } from "@/api/axiosInstance";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import Cookies from "js-cookie";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";
import { toast } from "sonner";
import { AxiosError } from "axios";

interface LoginPayload {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface ResetPasswordPayload {
  token: string;
  password: string;
}

interface UpdateUserPayload {
  firstName: string;
  lastName: string;
  language: string;
}

interface APIRequestErrorPayload {
  message: string;
  error: string;
  statusCode: number;
}

interface UseAuthProps {
  enableFetch: boolean;
}

export const useAuth = ({ enableFetch = false }: UseAuthProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const locale = useLocale();
  const { setUser, logout } = useAuthStore();

  const { data: user, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const response = await protectedAxiosInstance.get("/auth/me");
      return response.data;
    },
    retry: false,
    enabled: enableFetch,
  });

  const handleAuthSuccess = async () => {
    try {
      const response = await protectedAxiosInstance.get("/auth/me");
      const user = response.data;

      await queryClient.setQueryData(["authUser"], user);
      Cookies.set("userRole", user.role, { sameSite: "Strict" });
      Cookies.set("salesNavigator", user.accounts.salesNavigator, {
        sameSite: "Strict",
      });

      const lang = user.language || "en";
      router.push(`/${lang}/dashboard/home`);
    } catch (error) {
      console.error("Error fetching a user:", error);
    }
  };

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginPayload) => {
      const response = await axiosInstance.post("/auth/login", credentials);
      return response.data;
    },
    onSuccess: (data, variables) => {
      const { accessToken, refreshToken } = data;

      if (variables.rememberMe) {
        localStorage.setItem("accessToken", accessToken);
      }

      Cookies.set("accessToken", accessToken, { sameSite: "Strict" });
      Cookies.set("refreshToken", refreshToken, { sameSite: "Strict" });
      localStorage.setItem("refreshToken", refreshToken);

      handleAuthSuccess();
    },

    onError: (error: AxiosError<APIRequestErrorPayload>) => {
      const errorMessage = error.response?.data.message || "Login failed.";
      toast(errorMessage);
    },
  });

  const handleRegistrationSuccess = async (data: {
    accessToken: string;
    refreshToken: string;
  }) => {
    Cookies.set("accessToken", data.accessToken, {
      sameSite: "Strict",
    });
    Cookies.set("refreshToken", data.refreshToken, {
      sameSite: "Strict",
    });

    try {
      const response = await protectedAxiosInstance.get("/auth/me");
      const user = response.data;

      queryClient.setQueryData(["authUser"], user);
      Cookies.set("userRole", user.role, { sameSite: "Strict" });

      const lang = user.language || "en";
      router.push(`/${lang}/dashboard/home`);
    } catch (error) {
      console.error("Error fetching a user:", error);
    }
  };

  const logoutHandler = () => {
    logout();
    queryClient.setQueryData(["authUser"], null);

    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    Cookies.remove("userRole");

    router.replace(`/${locale}/sign-in`);
  };

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterPayload) => {
      const response = await axiosInstance.post("/auth/registration", data);
      return response.data;
    },
    onSuccess: handleRegistrationSuccess,
    onError: (error: AxiosError<APIRequestErrorPayload>) => {
      const errorMessage =
        error.response?.data.message || "Registration failed.";
      toast(errorMessage);
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: async (email: string) => {
      await axiosInstance.post(`/auth/forgot-password?email=${email}`);
    },
    onSuccess: () => {
      toast("Password reset link sent successfully");
    },
    onError: (error: AxiosError<APIRequestErrorPayload>) => {
      const errorMessage =
        error.response?.data.message || "Failed to send password reset link";
      toast(errorMessage);
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: ResetPasswordPayload) => {
      await axiosInstance.post("/auth/reset-password", data);
    },
    onSuccess: () => {
      router.replace(`/${locale}/sign-in`);
    },
    onError: (error: AxiosError<APIRequestErrorPayload>) => {
      const errorMessage =
        error.response?.data.message || "Failed to reset password";
      toast(errorMessage);
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

  const updateUserMutation = useMutation({
    mutationFn: async (data: UpdateUserPayload) => {
      const response = await protectedAxiosInstance.patch(
        `auth/users/${user.id}`,
        data
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["authUser"], data);
    },
  });

  const updateUserLanguageMutation = useMutation({
    mutationFn: async (data: { language: string }) => {
      const response = await protectedAxiosInstance.patch(
        `auth/users/${user.id}`,
        {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          language: data.language,
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["authUser"], data);
    },
    onError: (error: AxiosError<APIRequestErrorPayload>) => {
      const errorMessage =
        error.response?.data.message ||
        "Failed to update user language password";
      toast(errorMessage);
    },
  });

  const updateUserPassword = useMutation({
    mutationFn: async (data: { oldPassword: string; newPassword: string }) => {
      const response = await protectedAxiosInstance.put(
        `auth/users/${user.id}/password`,
        data
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["authUser"], data);
    },
    onError: (error: AxiosError<APIRequestErrorPayload>) => {
      const errorMessage =
        error.response?.data.message || "Failed to update password";
      toast(errorMessage);
    },
  });

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user, setUser]);

  return {
    user,
    isLoading,
    login: loginMutation.mutate,
    logout: logoutHandler,
    register: registerMutation.mutate,
    refreshTokens: refreshTokensMutation.mutate,
    forgotPassword: forgotPasswordMutation.mutateAsync,
    resetPassword: resetPasswordMutation.mutate,
    validateResetToken: validateResetTokenQuery.mutate,
    updateUser: updateUserMutation.mutate,
    updateUserLanguage: updateUserLanguageMutation.mutate,
    updateUserPassword: updateUserPassword.mutateAsync,
  };
};
