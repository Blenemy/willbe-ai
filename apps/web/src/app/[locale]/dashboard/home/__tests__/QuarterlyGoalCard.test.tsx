import { fireEvent, render, screen } from "@testing-library/react";
import QuarterlyGoalCard from "../components/QuarterlyGoalCard";

jest.mock("@/hooks/useHomepage", () => ({
  useQuarterlyGoal: jest.fn(),
  useUpdateQuarterlyGoal: jest.fn(),
}));

jest.mock("@/utils/handleAxiosError/handleAxiosError", () => ({
  handleAxiosError: jest.fn(),
}));

const { useQuarterlyGoal, useUpdateQuarterlyGoal } = jest.requireMock(
  "@/hooks/useHomepage"
);

describe("QuarterlyGoalCard component", () => {
  const mutate = jest.fn();

  beforeEach(() => {
    mutate.mockReset();
    useUpdateQuarterlyGoal.mockReturnValue({ mutate, isPending: false });
    useQuarterlyGoal.mockReturnValue({
      quarterlyGoal: {
        quarter: "2026-Q4",
        goal: 20000,
        won: 16000,
        pipeline: 60000,
        currency: "EUR",
      },
      isLoading: false,
      error: null,
    });
  });

  it("shows progress towards the goal and the pipeline", () => {
    render(<QuarterlyGoalCard />);
    expect(screen.getByText("Q4 2026")).toBeInTheDocument();
    expect(screen.getByText("80%")).toBeInTheDocument();
    expect(screen.getByText("€16,000")).toBeInTheDocument();
    expect(screen.getByText("€20,000")).toBeInTheDocument();
    expect(screen.getByText("€60,000")).toBeInTheDocument();
  });

  it("saves a new goal from the editor", () => {
    render(<QuarterlyGoalCard />);
    fireEvent.click(
      screen.getByRole("button", { name: "Edit quarterly goal" })
    );
    fireEvent.change(screen.getByLabelText(/Goal for Q4 2026/), {
      target: { value: "25000" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(mutate).toHaveBeenCalledWith(25000, expect.any(Object));
  });
});
