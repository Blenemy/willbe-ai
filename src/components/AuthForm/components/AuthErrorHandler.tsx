"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const AuthErrorHandler = () => {
  const searchParams = useSearchParams();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    const error = searchParams.get("error");
    if (error) {
      console.log("Auth error:", error);
      toast.error(error);
    }
  }, [hydrated, searchParams]);

  return null;
};
