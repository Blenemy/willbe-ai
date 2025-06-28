import { render } from "@testing-library/react";
import LeadTable from "./LeadTable";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useSearchLeads } from "@/hooks/useSearchLeads";
import { useSavedLeads } from "@/hooks/useSavedLeads";

jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(),
}));
jest.mock("@/hooks/useSearchLeads", () => ({
  useSearchLeads: jest.fn(),
}));
jest.mock("@/hooks/useSavedLeads", () => ({
  useSavedLeads: jest.fn(),
}));
jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

describe("LeadTable cursor propagation", () => {
  it("should pass lastPageCursor to useSearchLeads on initial render", () => {
    (useSearchParams as jest.Mock).mockReturnValue({
      get: () => "test-scenario-id",
    });

    const useSearchLeadsMock = useSearchLeads as jest.Mock;
    useSearchLeadsMock.mockReturnValue({
      searchLeads: [],
      paging: { total_count: 30, page_count: 30, start: 0 },
      cursor: null,
      isFetching: false,
    });

    (useSavedLeads as jest.Mock).mockReturnValue({
      saveSelectedLeads: jest.fn(),
    });

    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <LeadTable
          setCurrentStep={jest.fn()}
          lastPageCursor="mock-cursor-xyz"
        />
      </QueryClientProvider>
    );

    expect(useSearchLeadsMock).toHaveBeenCalledWith(
      expect.objectContaining({
        cursor: "mock-cursor-xyz",
      })
    );
  });
});
