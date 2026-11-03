import { render, screen, fireEvent } from "@testing-library/react";
import { AccountsTable } from "../AccountsTable";
import { useState } from "react";

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

const mockData = [
  {
    id: "1",
    accountData: {
      name: "Alpha Corp",
      industry: "Tech",
      headcount: 100,
      location: "Berlin",
      summary: "Innovative tech company",
      profile_url: "#",
      logo: "",
    },
  },
  {
    id: "2",
    accountData: {
      name: "Beta LLC",
      industry: "Finance",
      headcount: 50,
      location: "London",
      summary: "Financial services provider",
      profile_url: "#",
      logo: "",
    },
  },
  {
    id: "3",
    accountData: {
      name: "Gamma Ltd",
      industry: "Retail",
      headcount: 200,
      location: "New York",
      summary: "Retail chain",
      profile_url: "#",
      logo: "",
    },
  },
];

function Wrapper() {
  const [selected, setSelected] = useState<string[]>([]);
  return (
    <AccountsTable
      //@ts-expect-error wrong mockData types
      data={mockData}
      selected={selected}
      setSelected={setSelected}
    />
  );
}

describe("AccountsTable – selection logic", () => {
  it("renders all rows", () => {
    render(<Wrapper />);
    const rows = screen.getAllByRole("row");
    expect(rows.length).toBe(4);
  });

  it("selects and unselects a single row", () => {
    render(<Wrapper />);
    const checkboxes = screen.getAllByRole("checkbox");
    const rowCheckbox = checkboxes[1];

    fireEvent.click(rowCheckbox);
    expect(rowCheckbox).toBeChecked();

    fireEvent.click(rowCheckbox);
    expect(rowCheckbox).not.toBeChecked();
  });

  it("selects all rows on current page", () => {
    render(<Wrapper />);
    const checkboxes = screen.getAllByRole("checkbox");
    const selectAll = checkboxes[0];

    fireEvent.click(selectAll);
    checkboxes.slice(1).forEach((cb) => expect(cb).toBeChecked());

    fireEvent.click(selectAll);
    checkboxes.slice(1).forEach((cb) => expect(cb).not.toBeChecked());
  });
});
