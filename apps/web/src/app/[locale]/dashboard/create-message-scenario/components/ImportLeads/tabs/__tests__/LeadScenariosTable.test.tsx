import { render, screen, fireEvent } from "@testing-library/react";
import { useState } from "react";
import { LeadScenariosTable } from "../LeadScenarioTable";

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

const mockData = [
  {
    id: "1",
    name: "Scenario One",
    createdAt: new Date().toISOString(),
    user: { firstName: "John", lastName: "Doe" },
  },
  {
    id: "2",
    name: "Scenario Two",
    createdAt: new Date().toISOString(),
    user: { firstName: "Jane", lastName: "Smith" },
  },
  {
    id: "3",
    name: "Scenario Three",
    createdAt: new Date().toISOString(),
    user: { firstName: "Alice", lastName: "Walker" },
  },
];

function Wrapper() {
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <LeadScenariosTable
      //@ts-expect-error wrong mockData types
      data={mockData}
      selected={selected}
      setSelected={setSelected}
    />
  );
}

describe("LeadScenariosTable – selection logic", () => {
  it("should render 3 rows", () => {
    render(<Wrapper />);
    const rows = screen.getAllByRole("row");
    expect(rows.length).toBe(4);
  });

  it("should select and unselect a single row", () => {
    render(<Wrapper />);

    const checkboxes = screen.getAllByRole("checkbox");
    const firstRowCheckbox = checkboxes[1];

    fireEvent.click(firstRowCheckbox);
    expect(firstRowCheckbox).toBeChecked();

    fireEvent.click(firstRowCheckbox);
    expect(firstRowCheckbox).not.toBeChecked();
  });

  it("should select all on page and then unselect all", () => {
    render(<Wrapper />);

    const checkboxes = screen.getAllByRole("checkbox");
    const selectAllCheckbox = checkboxes[0];

    fireEvent.click(selectAllCheckbox);

    checkboxes.slice(1).forEach((cb) => expect(cb).toBeChecked());

    fireEvent.click(selectAllCheckbox);
    checkboxes.slice(1).forEach((cb) => expect(cb).not.toBeChecked());
  });
});
