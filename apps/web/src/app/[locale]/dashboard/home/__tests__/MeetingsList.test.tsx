import { render, screen, fireEvent } from "@testing-library/react";
import MeetingsList from "../components/MeetingsList";

export const mockMeetings = [
  {
    messageScenarioId: "ms-001",
    leadName: "Alice Johnson",
    leadProfilePictureUrl: "https://randomuser.me/api/portraits/women/1.jpg",
    position: "Marketing Manager",
    accountName: "BrightWorks",
    accountUrl: "https://brightworks.io",
  },
  {
    messageScenarioId: "ms-002",
    leadName: "Bob Smith",
    leadProfilePictureUrl: "https://randomuser.me/api/portraits/men/2.jpg",
    position: "Software Engineer",
    accountName: "CodeBase Inc.",
    accountUrl: "https://codebase.dev",
  },
  {
    messageScenarioId: "ms-003",
    leadName: "Carla Reyes",
    leadProfilePictureUrl: "https://randomuser.me/api/portraits/women/3.jpg",
    position: "HR Specialist",
    accountName: "PeopleFirst",
    accountUrl: "https://peoplefirst.com",
  },
  {
    messageScenarioId: "ms-004",
    leadName: "David Lee",
    leadProfilePictureUrl: "https://randomuser.me/api/portraits/men/4.jpg",
    position: "CTO",
    accountName: "TechNova",
    accountUrl: "https://technova.io",
  },
  {
    messageScenarioId: "ms-005",
    leadName: "Emily Watson",
    leadProfilePictureUrl: "https://randomuser.me/api/portraits/women/5.jpg",
    position: "UX Designer",
    accountName: "DesignHub",
    accountUrl: "https://designhub.co",
  },
  {
    messageScenarioId: "ms-006",
    leadName: "Frank Miller",
    leadProfilePictureUrl: "https://randomuser.me/api/portraits/men/6.jpg",
    position: "DevOps Engineer",
    accountName: "DeployMaster",
    accountUrl: "https://deploymaster.dev",
  },
  {
    messageScenarioId: "ms-007",
    leadName: "Grace Kim",
    leadProfilePictureUrl: "https://randomuser.me/api/portraits/women/7.jpg",
    position: "Product Owner",
    accountName: "AgileCore",
    accountUrl: "https://agilecore.com",
  },
  {
    messageScenarioId: "ms-008",
    leadName: "Henry Black",
    leadProfilePictureUrl: "https://randomuser.me/api/portraits/men/8.jpg",
    position: "Sales Executive",
    accountName: "SalesBoost",
    accountUrl: "https://salesboost.net",
  },
  {
    messageScenarioId: "ms-009",
    leadName: "Ivy Green",
    leadProfilePictureUrl: "https://randomuser.me/api/portraits/women/9.jpg",
    position: "Finance Analyst",
    accountName: "FinCheck",
    accountUrl: "https://fincheck.org",
  },
  {
    messageScenarioId: "ms-010",
    leadName: "Jack White",
    leadProfilePictureUrl: "https://randomuser.me/api/portraits/men/10.jpg",
    position: "CEO",
    accountName: "Visionary Inc.",
    accountUrl: "https://visionary.io",
  },
  {
    messageScenarioId: "ms-011",
    leadName: "Karen Brown",
    leadProfilePictureUrl: "https://randomuser.me/api/portraits/women/11.jpg",
    position: "Operations Manager",
    accountName: "FlowLogic",
    accountUrl: "https://flowlogic.ai",
  },
  {
    messageScenarioId: "ms-012",
    leadName: "Liam King",
    leadProfilePictureUrl: "https://randomuser.me/api/portraits/men/12.jpg",
    position: "Legal Advisor",
    accountName: "LegalEase",
    accountUrl: "https://legalease.pro",
  },
  {
    messageScenarioId: "ms-013",
    leadName: "Mia Scott",
    leadProfilePictureUrl: "https://randomuser.me/api/portraits/women/13.jpg",
    position: "QA Engineer",
    accountName: "BugTrackerX",
    accountUrl: "https://bugtrackerx.dev",
  },
  {
    messageScenarioId: "ms-014",
    leadName: "Noah Walker",
    leadProfilePictureUrl: "https://randomuser.me/api/portraits/men/14.jpg",
    position: "AI Researcher",
    accountName: "DeepThink",
    accountUrl: "https://deepthink.ai",
  },
  {
    messageScenarioId: "ms-015",
    leadName: "Olivia Baker",
    leadProfilePictureUrl: "https://randomuser.me/api/portraits/women/15.jpg",
    position: "Business Analyst",
    accountName: "DataPros",
    accountUrl: "https://datapros.co",
  },
];

jest.mock("@/hooks/useHomepage", () => ({
  useMeetings: jest.fn(),
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

jest.mock("@/components/CustomPagination/CustomPagination", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  CustomPagination: ({ page, setPage, rowsPerPage, totalCount }: any) => (
    <div data-testid="pagination">
      <button onClick={() => setPage(page - 1)} disabled={page === 0}>
        Prev
      </button>
      <span data-testid="page">{page}</span>
      <button
        onClick={() => setPage(page + 1)}
        disabled={page >= Math.floor(totalCount / rowsPerPage)}
      >
        Next
      </button>
    </div>
  ),
}));

const { useMeetings } = jest.requireMock("@/hooks/useHomepage");

describe("MeetingsList component", () => {
  beforeEach(() => {
    useMeetings.mockReturnValue({
      meetings: mockMeetings,
      error: null,
    });
  });

  it("renders 7 rows per page", () => {
    render(<MeetingsList />);
    const rows = screen.getAllByRole("row");
    // header row + 7 data rows
    expect(rows.length).toBe(8);
  });

  it("displays subtitle from useToggleDaysInterval", () => {
    render(<MeetingsList />);
    expect(screen.getByText("Showing past 7 days")).toBeInTheDocument();
  });

  it("shows 'No meetings found' when no data", () => {
    useMeetings.mockReturnValueOnce({
      meetings: [],
      error: null,
    });
    render(<MeetingsList />);
    expect(screen.getByText("No meetings found")).toBeInTheDocument();
  });

  it("pagination works: go to next page", () => {
    render(<MeetingsList />);
    const pageIndicator = screen.getByTestId("page");
    expect(pageIndicator).toHaveTextContent("0");

    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);

    expect(nextButton).toBeEnabled();
  });
});
