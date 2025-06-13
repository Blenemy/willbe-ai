import { AxiosError } from "axios";
import { toast } from "sonner";
import { handleAxiosError } from "./handleAxiosError";

jest.mock("sonner", () => ({
  toast: jest.fn(),
}));

describe("handleAxiosError", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should handle AxiosError with response message", () => {
    const err = {
      isAxiosError: true,
      response: { data: { message: "API error" } },
      message: "Fallback error",
    } as unknown as AxiosError<{ message: string }>;

    handleAxiosError(err);
    expect(toast).toHaveBeenCalledWith("API error");
  });

  it("should fallback to AxiosError.message if no response message", () => {
    const err = {
      isAxiosError: true,
      response: { data: {} },
      message: "Just fallback",
    } as unknown as AxiosError;

    handleAxiosError(err);
    expect(toast).toHaveBeenCalledWith("Just fallback");
  });

  it("should fallback to default if no message at all", () => {
    const err = {} as unknown;

    handleAxiosError(err);
    expect(toast).toHaveBeenCalledWith("Something went wrong");
  });

  it("should handle regular Error", () => {
    const err = new Error("Native error");
    handleAxiosError(err);
    expect(toast).toHaveBeenCalledWith("Native error");
  });
});
