import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, FC } from "react";

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

export const withQueryClient: FC<{ children: ReactNode }> = ({ children }) => {
  const client = createTestQueryClient();
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};
