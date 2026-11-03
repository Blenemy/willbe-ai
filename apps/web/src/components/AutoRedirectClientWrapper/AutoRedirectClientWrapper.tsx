"use client";

import { useAutoLogin } from "@/hooks/useAutoLogin";

export const AutoRedirectClientWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  useAutoLogin();
  return <>{children}</>;
};
