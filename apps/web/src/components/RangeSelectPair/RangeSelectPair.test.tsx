import { render, screen } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import { RangeSelectPair } from "./RangePairSelect";
import userEvent from "@testing-library/user-event";

interface RangeFormValues {
  from: string;
  to: string;
}

const Wrapper = ({
  children,
  defaultValues = { from: "", to: "" },
}: {
  children: React.ReactNode;
  defaultValues?: RangeFormValues;
}) => {
  const methods = useForm({ defaultValues });
  return <FormProvider {...methods}>{children}</FormProvider>;
};

const defaultProps = {
  fromName: "from",
  toName: "to",
  fromOptions: ["1", "2", "3", "4", "5"],
  toOptions: ["1", "2", "3", "4", "5"],
  placeholderFrom: "From",
  placeholderTo: "To",
  clearField: jest.fn(),
};

describe("RangeSelectPair", () => {
  it("renders with placeholder text", () => {
    render(
      <Wrapper>
        <RangeSelectPair {...defaultProps} />
      </Wrapper>
    );

    expect(screen.getByRole("combobox", { name: /from/i })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: /to/i })).toBeInTheDocument();
  });

  it("renders all 'fromOptions' when clicked", async () => {
    render(
      <Wrapper>
        <RangeSelectPair {...defaultProps} />
      </Wrapper>
    );

    await userEvent.click(screen.getByRole("combobox", { name: /from/i }));

    const items = await screen.findAllByTestId("select-item-from");
    expect(items).toHaveLength(5);
  });

  it("filters 'toOptions' to values greater than selected 'from'", async () => {
    render(
      <Wrapper defaultValues={{ from: "3", to: "" }}>
        <RangeSelectPair {...defaultProps} />
      </Wrapper>
    );

    await userEvent.click(screen.getByRole("combobox", { name: /to/i }));

    const visibleOptions = await screen.findAllByRole("option");
    const values = visibleOptions.map((el) => el.textContent);
    expect(values).toEqual(["4", "5"]);
  });

  it("filters 'fromOptions' to values less than selected 'to'", async () => {
    render(
      <Wrapper defaultValues={{ from: "", to: "3" }}>
        <RangeSelectPair {...defaultProps} />
      </Wrapper>
    );

    await userEvent.click(screen.getByRole("combobox", { name: /from/i }));

    const visibleOptions = await screen.findAllByRole("option");
    const values = visibleOptions.map((el) => el.textContent);
    expect(values).toEqual(["1", "2"]);
  });
});
