import { render, screen } from "@testing-library/react";
import { act } from "react";
import ScenarioPerformanceChart from "../components/ScenarioPerfomanceChart";

jest.mock("@/hooks/useToggleDaysInterval", () => ({
  useToggleDaysInterval: jest.fn(() => ({
    daysInterval: 7,
    toggleInterval: jest.fn(),
    subtitleText: "Last 7 days",
  })),
}));

jest.mock("@/hooks/useHomepage", () => ({
  useScenarioPerformance: jest.fn(),
}));

jest.mock("@/utils/handleAxiosError/handleAxiosError", () => ({
  handleAxiosError: jest.fn(),
}));

jest.mock("recharts");

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { useScenarioPerformance } = require("@/hooks/useHomepage");

describe("ScenarioPerformanceChart component", () => {
  beforeEach(() => {
    useScenarioPerformance.mockReturnValue({
      performance: {
        account: 10,
        lead: 15,
        meetings: 8,
        responses: 12,
        outOfOffice: 5,
        bounced: 3,
      },
      error: null,
    });
  });

  it("renders title and subtitle", () => {
    render(<ScenarioPerformanceChart />);
    expect(screen.getByText("Scenario performance")).toBeInTheDocument();
    expect(screen.getByText("Last 7 days")).toBeInTheDocument();
  });

  it("renders correct number of bars", () => {
    const { container } = render(<ScenarioPerformanceChart />);
    const bars = container.querySelectorAll(".mock-bar");
    expect(bars.length).toBe(6);
  });

  it("handles error if provided", () => {
    const mockHandleError =
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("@/utils/handleAxiosError/handleAxiosError").handleAxiosError;

    useScenarioPerformance.mockReturnValueOnce({
      performance: null,
      error: new Error("Network error"),
    });

    act(() => {
      render(<ScenarioPerformanceChart />);
    });

    expect(mockHandleError).toHaveBeenCalledWith(
      expect.any(Error),
      "Failed to get the scenario performance"
    );
  });
});
