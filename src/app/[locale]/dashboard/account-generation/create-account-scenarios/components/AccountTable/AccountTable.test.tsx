import { render, screen } from "@testing-library/react";
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

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
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

    render(<AccountTable />);

    const checkboxes = screen.getAllByRole("checkbox");
    const targetCheckbox = checkboxes.find((el) => el.hasAttribute("disabled"));

    expect(targetCheckbox).toBeDefined();
    expect(targetCheckbox).toBeDisabled();
  });
});
