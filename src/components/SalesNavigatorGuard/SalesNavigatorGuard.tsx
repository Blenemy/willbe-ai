"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

export function SalesNavigatorGuard() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get("error");

    if (error === "sales_navigator_required") {
      toast("This page requires a Sales Navigator subscription.");
    }
  }, [searchParams]);

  return null;
}
