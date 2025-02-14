"use client";

import { Button } from "@/components/ui/button";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";
import Link from "next/link";

interface AuthLinkProps {
  label: string;
  variant: "sign-in" | "sign-up";
  buttonVariant?: "link" | "default";
}

export const AuthLink = ({
  label,
  variant,
  buttonVariant = "default",
}: AuthLinkProps) => {
  const signInPath = useLocalizedPath(`/${variant}`);

  return (
    <Link href={signInPath}>
      <Button variant={buttonVariant}>{label}</Button>
    </Link>
  );
};
