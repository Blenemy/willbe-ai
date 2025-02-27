import axios from "axios";
import Cookies from "js-cookie";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const protectedAxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

protectedAxiosInstance.interceptors.request.use((config) => {
  const accessToken = Cookies.get("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

protectedAxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const refreshToken = Cookies.get("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const { data } = await axiosInstance.post("/auth/refresh-tokens", {
          refreshToken,
        });

        Cookies.set("accessToken", data.accessToken, {
          secure: true,
          sameSite: "Strict",
        });
        Cookies.set("refreshToken", data.refreshToken, {
          secure: true,
          sameSite: "Strict",
        });

        error.config.headers.Authorization = `Bearer ${data.accessToken}`;
        return protectedAxiosInstance.request(error.config);
      } catch (refreshError) {
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        window.location.href = "/sign-in";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
