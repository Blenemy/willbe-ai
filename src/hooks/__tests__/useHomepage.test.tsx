import { renderHook, waitFor } from "@testing-library/react";
import { protectedAxiosInstance } from "@/api/axiosInstance";
import { withQueryClient } from "../../../__mocks__/test-utils";
import {
  useMeetings,
  useMeetingsResponseRate,
  useScenarioPerformance,
} from "../useHomepage";

jest.mock("@/api/axiosInstance");

describe("Hooks from useHomepage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches meetings data", async () => {
    const mockData = [
      {
        messageScenarioId: "123",
        leadName: "Test Lead",
        leadProfilePictureUrl: "https://test.jpg",
        position: "Engineer",
        accountName: "Test Inc",
        accountUrl: "https://test.com",
      },
    ];

    (protectedAxiosInstance.get as jest.Mock).mockResolvedValue({
      data: mockData,
    });

    const { result } = renderHook(
      () =>
        useMeetings({
          enableFetch: true,
          daysInterval: 7,
          limit: 10,
          offset: 0,
        }),
      { wrapper: withQueryClient }
    );

    await waitFor(() => expect(result.current.meetings).toEqual(mockData));
  });

  it("fetches meetings response rate", async () => {
    const mockData = { responseRate: "50", meetingRate: "75" };

    (protectedAxiosInstance.get as jest.Mock).mockResolvedValue({
      data: mockData,
    });

    const { result } = renderHook(
      () => useMeetingsResponseRate({ enableFetch: true, daysInterval: 7 }),
      { wrapper: withQueryClient }
    );

    await waitFor(() => {
      expect(result.current.responseRate).toBe("50");
      expect(result.current.meetingRate).toBe("75");
    });
  });

  it("fetches scenario performance", async () => {
    const mockData = {
      account: 1,
      lead: 2,
      meetings: 3,
      responses: 4,
      outOfOffice: 5,
      bounced: 6,
    };

    (protectedAxiosInstance.get as jest.Mock).mockResolvedValue({
      data: mockData,
    });

    const { result } = renderHook(
      () => useScenarioPerformance({ enableFetch: true, daysInterval: 30 }),
      { wrapper: withQueryClient }
    );

    await waitFor(() => {
      expect(result.current.performance).toEqual(mockData);
    });
  });
});
