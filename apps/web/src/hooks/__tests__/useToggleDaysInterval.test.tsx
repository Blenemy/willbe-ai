import { renderHook, act } from "@testing-library/react";
import { useToggleDaysInterval } from "../useToggleDaysInterval";

describe("useToggleDaysInterval", () => {
  it("should return default value 7 and correct subtitle", () => {
    const { result } = renderHook(() => useToggleDaysInterval());

    expect(result.current.daysInterval).toBe(7);
    expect(result.current.subtitleText).toBe("In the last week");
  });

  it("should toggle from 7 to 30 and update subtitle", () => {
    const { result } = renderHook(() => useToggleDaysInterval());

    act(() => {
      result.current.toggleInterval();
    });

    expect(result.current.daysInterval).toBe(30);
    expect(result.current.subtitleText).toBe("In the last month");
  });

  it("should toggle back to 7", () => {
    const { result } = renderHook(() => useToggleDaysInterval());

    act(() => {
      result.current.toggleInterval();
      result.current.toggleInterval();
    });

    expect(result.current.daysInterval).toBe(7);
    expect(result.current.subtitleText).toBe("In the last week");
  });
});
