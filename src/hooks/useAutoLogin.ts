import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useAuthStore } from "@/store/useAuthStore";

export const useAutoLogin = () => {
  const router = useRouter();
  const locale = useLocale();
  const { user } = useAuthStore();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (!user && accessToken) {
      router.replace(`/${locale}/dashboard/home`);
    }
  }, [user, router, locale]);
};
