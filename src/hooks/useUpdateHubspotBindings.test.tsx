import { renderHook } from "@testing-library/react";
import { toast } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act } from "react-dom/test-utils";
import { protectedAxiosInstance } from "@/api/axiosInstance";
import { useUpdateHubspotBindings } from "./useConnectHubspot";

jest.mock("sonner", () => ({
  toast: jest.fn(),
}));

jest.mock("@/api/axiosInstance", () => ({
  protectedAxiosInstance: {
    patch: jest.fn(),
  },
}));

describe("useUpdateHubspotBindings", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={new QueryClient()}>
      {children}
    </QueryClientProvider>
  );

  it("calls onError and toast when mutation fails", async () => {
    (protectedAxiosInstance.patch as jest.Mock).mockRejectedValueOnce(
      new Error("Fail")
    );

    const { result } = renderHook(() => useUpdateHubspotBindings(), {
      wrapper,
    });

    await act(async () => {
      result.current.mutate({
        companyId: "123",
        data: { field: "value" },
      });
    });

    expect(toast).toHaveBeenCalledWith("Fail");
  });
});
