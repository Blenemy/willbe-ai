"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";

export const useAutoLogin = () => {
  const { user, setUser } = useAuthStore();
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const isDashboardPage = pathname?.startsWith("/dashboard");

    if (!accessToken && isDashboardPage) {
      router.replace("/sign-in");
    }
  }, [user, setUser, queryClient, pathname, router]);
};
