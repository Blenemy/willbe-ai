"use client";

import { useCallback } from "react";

export const useSocialAuth = () => {
  const redirectTo = useCallback(
    (provider: "google" | "microsoft" | "linkedin") => {
      const baseUrl = "https://app.willbe.ai/api/auth";

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
