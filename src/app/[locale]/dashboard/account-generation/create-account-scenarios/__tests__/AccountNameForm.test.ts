import { render, screen } from "@testing-library/react";
import { createElement } from "react";

jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(),
}));

jest.mock("@/hooks/useAccountScenarios", () => ({
  useAccountScenarios: () => ({
    createAccountScenario: jest.fn(),
    updateAccountScenario: jest.fn(),
  }),
}));

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

// eslint-disable-next-line @typescript-eslint/no-require-imports
const mockUseSearchParams = require("next/navigation").useSearchParams;

describe("AccountNameForm (without JSX)", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("prefills input with accountName from query", async () => {
    mockUseSearchParams.mockReturnValue({
      get: (key: string) => (key === "accountName" ? "TestCo" : "123"),
    });

    const AccountNameForm = (await import("../components/AccountNameForm"))
      .default;
    render(createElement(AccountNameForm));

    const input = screen.getByPlaceholderText(
      "form_name_placeholder"
    ) as HTMLInputElement;
    expect(input.value).toBe("TestCo");
  });

  it("shows empty input when no accountName in query", async () => {
    mockUseSearchParams.mockReturnValue({
      get: () => null,
    });

    const AccountNameForm = (await import("../components/AccountNameForm"))
      .default;
    render(createElement(AccountNameForm));

    const input = screen.getByPlaceholderText(
      "form_name_placeholder"
    ) as HTMLInputElement;
    expect(input.value).toBe("");
  });
});
