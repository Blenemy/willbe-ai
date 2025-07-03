import { render, act } from "@testing-library/react";
import { useEffect } from "react";
import { useDebouncedValue } from "../useDebounce";

function TestComponent({
  value,
  delay,
  onDebouncedChange,
}: {
  value: string;
  delay: number;
  onDebouncedChange: (v: string) => void;
}) {
  const debounced = useDebouncedValue(value, delay);

  useEffect(() => {
    onDebouncedChange(debounced);
  }, [debounced, onDebouncedChange]);

  return null;
}

jest.useFakeTimers();

describe("useDebouncedValue", () => {
  it("debounces the value", () => {
    const mockFn = jest.fn();

    const { rerender } = render(
      <TestComponent value="initial" delay={300} onDebouncedChange={mockFn} />
    );

    act(() => {
      jest.advanceTimersByTime(300);
    });

    mockFn.mockClear();

    rerender(
      <TestComponent value="changed" delay={300} onDebouncedChange={mockFn} />
    );

    expect(mockFn).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith("changed");
  });
});
