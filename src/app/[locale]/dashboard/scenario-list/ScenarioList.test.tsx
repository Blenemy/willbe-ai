import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ScenarioList from "./page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

jest.mock("@/hooks/useMessageScenarios", () => ({
  useMessageScenarios: () => ({
    data: [
      {
        id: "1",
        name: "Test Scenario",
        user: { firstName: "John", lastName: "Doe" },
        leadsInCadence: 10,
        messagesSent: 5,
        status: "done",
        createdAt: new Date().toISOString(),
        bounceRate: "15%",
        outOfOffice: "12%",
      },
    ],
  }),
  useDeleteMessageScenarios: () => ({
    mutate: jest.fn(),
  }),
}));

const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
};

describe("ScenarioList - column visibility", () => {
  it("should NOT show Bounce Rate column by default", () => {
    renderWithProviders(<ScenarioList />);
    const bounceHeader = screen.queryByText("table.bounceRate");
    expect(bounceHeader).not.toBeInTheDocument();
  });

  it("should show Bounce Rate column after enabling it", async () => {
    renderWithProviders(<ScenarioList />);
    const user = userEvent.setup();

    const viewButton = screen.getByRole("button", { name: /view/i });
    await user.click(viewButton);

    const bounceCheckbox = await screen.findByRole("menuitemcheckbox", {
      name: /table.bounceRate/i,
    });
    await user.click(bounceCheckbox);

    const bounceHeaders = screen.getAllByText("table.bounceRate");
    expect(bounceHeaders.length).toBeGreaterThan(0);
  });

  it("should show Out of Office column after enabling it", async () => {
    renderWithProviders(<ScenarioList />);
    const user = userEvent.setup();

    const viewButton = screen.getByRole("button", { name: /view/i });
    await user.click(viewButton);

    const oooCheckbox = await screen.findByRole("menuitemcheckbox", {
      name: /table.outOfOffice/i,
    });
    await user.click(oooCheckbox);

    const oooHeaders = screen.getAllByText("table.outOfOffice");

    expect(oooHeaders.length).toBeGreaterThan(0);
  });
});
