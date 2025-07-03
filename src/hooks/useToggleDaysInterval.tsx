import { useState } from "react";

export function useToggleDaysInterval() {
  const [daysInterval, setDaysInterval] = useState<7 | 30>(7);

  const toggleInterval = () => {
    setDaysInterval((prev) => (prev === 7 ? 30 : 7));
  };

  const subtitleText =
    daysInterval === 7 ? "In the last week" : "In the last month";

  return {
    daysInterval,
    toggleInterval,
    subtitleText,
  };
}
