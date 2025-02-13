"use client";

import { useQuery } from "@tanstack/react-query";

export function useFetch<T>(url: string, queryKey: string[]) {
  return useQuery<T>({
    queryKey,
    queryFn: async () => {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch data");
      return response.json();
    },
  });
}
