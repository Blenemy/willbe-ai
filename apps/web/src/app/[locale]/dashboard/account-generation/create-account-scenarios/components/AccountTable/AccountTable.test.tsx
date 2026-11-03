import { render, screen, waitFor } from "@testing-library/react";
import AccountTable from "./AccountTable";
import { usePaginatedAccountsSearch } from "@/hooks/usePaginatedAccountsSearch";
import { useSelectedCompaniesStore } from "@/store/useSelectedCompaniesStore";

jest.mock("@/hooks/usePaginatedAccountsSearch", () => ({
  usePaginatedAccountsSearch: jest.fn(),
}));

jest.mock("@/store/useSelectedCompaniesStore", () => ({
  useSelectedCompaniesStore: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: () => "test-id",
  }),
}));

jest.mock("@/hooks/usePaginatedAccountsSearch");

jest.mock("@/store/useSelectedCompaniesStore", () => ({
  useSelectedCompaniesStore: jest.fn(() => ({
    selectedCompanies: {},
    toggleCompany: jest.fn(),
    addCompanies: jest.fn(),
    removeCompanies: jest.fn(),
    clear: jest.fn(),
  })),
}));

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
}));

describe("AccountTable — disabled checkbox", () => {
  it("renders checkbox as disabled if company.isSaved is true", () => {
    (usePaginatedAccountsSearch as jest.Mock).mockReturnValue({
      data: {
        items: [
          {
            id: "123",
            name: "Saved Company",
            industry: "Tech",
            headcount: "50",
            profile_url: "https://linkedin.com/company/saved",
            summary: "Summary here",
            logo: "/logo.png",
            isSaved: true,
          },
        ],
        paging: {
          total_count: 1,
        },
        cursor: null,
      },
      isFetching: false,
      saveSelectedAccounts: jest.fn(),
    });

    const mockedStore = useSelectedCompaniesStore as unknown as jest.Mock;
    mockedStore.mockReturnValue({
      selectedCompanies: {},
      toggleCompany: jest.fn(),
      addCompanies: jest.fn(),
      removeCompanies: jest.fn(),
      clear: jest.fn(),
    });

    render(<AccountTable cursors={{ lastPageCursor: null, previousPageCursor: null }} />);

    const checkboxes = screen.getAllByRole("checkbox");
    const targetCheckbox = checkboxes.find((el) => el.hasAttribute("disabled"));

    expect(targetCheckbox).toBeDefined();
    expect(targetCheckbox).toBeDisabled();
  });
});

describe("AccountTable - debounce & skeleton behavior", () => {
  it("shows skeleton on initial loading", () => {
    (usePaginatedAccountsSearch as jest.Mock).mockReturnValue({
      data: undefined,
      isFetching: true,
      saveSelectedAccounts: jest.fn(),
    });

    render(<AccountTable cursors={{ lastPageCursor: null, previousPageCursor: null }} />);
    expect(screen.getAllByTestId("skeleton-row")).toHaveLength(12);
  });

  it("renders table when data is loaded and not fetching", async () => {
    const mockData = {
      items: [
        {
          id: "1",
          name: "Company One",
          logo: "logo.png",
          industry: "Tech",
          headcount: "51-200",
          profile_url: "https://linkedin.com/1",
          summary: "A great company",
          isSaved: false,
        },
      ],
      paging: { total_count: 1 },
      cursor: null,
    };

    (usePaginatedAccountsSearch as jest.Mock).mockReturnValue({
      data: mockData,
      isFetching: false,
      saveSelectedAccounts: jest.fn(),
    });

    render(<AccountTable cursors={{ lastPageCursor: null, previousPageCursor: null }} />);

    await waitFor(() => {
      expect(screen.getByText("Company One")).toBeInTheDocument();
    });
  });
});
