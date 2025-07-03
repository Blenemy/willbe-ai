import { render, screen } from "@testing-library/react";
import MeetingsResponsesCard from "../components/MeetingsResponsesCard";

jest.mock("@/hooks/useHomepage", () => ({
  useMeetingsResponseRate: jest.fn(),
}));

jest.mock("@/hooks/useToggleDaysInterval", () => ({
  useToggleDaysInterval: jest.fn(() => ({
    daysInterval: 7,
    toggleInterval: jest.fn(),
    subtitleText: "Showing past 7 days",
  })),
}));

jest.mock("@/utils/handleAxiosError/handleAxiosError", () => ({
  handleAxiosError: jest.fn(),
}));

const { useMeetingsResponseRate } = jest.requireMock("@/hooks/useHomepage");

describe("MeetingsResponsesCard component", () => {
  beforeEach(() => {
    useMeetingsResponseRate.mockReturnValue({
      meetingRate: 80,
      responseRate: 60,
      error: null,
    });
  });

  it("renders meeting and response rates correctly", () => {
    render(<MeetingsResponsesCard />);
    expect(screen.getByText("Meetings & responses")).toBeInTheDocument();
    expect(screen.getByText("Showing past 7 days")).toBeInTheDocument();
    expect(screen.getByText("80%")).toBeInTheDocument();
    expect(screen.getByText("60%")).toBeInTheDocument();
  });

  it("displays section titles", () => {
    render(<MeetingsResponsesCard />);
    expect(screen.getByText("Meeting rate")).toBeInTheDocument();
    expect(screen.getByText("Response rate")).toBeInTheDocument();
  });

  it("renders toggle interval button", () => {
    render(<MeetingsResponsesCard />);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("calls error handler if error exists", () => {
    const mockHandleError =
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("@/utils/handleAxiosError/handleAxiosError").handleAxiosError;
    useMeetingsResponseRate.mockReturnValueOnce({
      meetingRate: 0,
      responseRate: 0,
      error: new Error("Network error"),
    });

    render(<MeetingsResponsesCard />);
    expect(mockHandleError).toHaveBeenCalledWith(
      expect.any(Error),
      "Failed to get the meeting response rate"
    );
  });
});
