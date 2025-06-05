import { create } from "zustand";
import { Scenario } from "@/hooks/useMessageScenarios";

interface ScenarioStepStore {
  activeStep: number;
  setActiveStep: (step: number) => void;
  initStep: (scenario: Scenario) => void;
}

export const useScenarioStepStore = create<ScenarioStepStore>((set) => ({
  activeStep: 0,

  setActiveStep: (step) => set({ activeStep: step }),

  initStep: (scenario) => {
    const { status, leads } = scenario;
    const leadsCount = leads.length;

    let step = 0;

    if (status === "done" || status === "in_progress") {
      step = 2;
    } else if (status === "not_started" && leadsCount > 0) {
      step = 1;
    } else if (status === "not_started" && leadsCount === 0) {
      step = 0;
    }

    set({ activeStep: step });
  },
}));
