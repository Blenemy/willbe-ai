"use client";

import { useCallback } from "react";

export const useSocialAuth = () => {
  const redirectTo = useCallback(
    (provider: "google" | "microsoft" | "linkedin") => {
      const baseUrl = `${process.env.NEXT_PUBLIC_API_URL ?? ""}/auth`;

      const urls: Record<typeof provider, string> = {
        google: `${baseUrl}/google`,
        microsoft: `${baseUrl}/microsoft`,
        linkedin: `${baseUrl}/linkedin`,
      };

      window.location.href = urls[provider];
    },
    []
  );

  return { redirectTo };
};
