"use client";

import { cn } from "@/lib/utils";

export function ScenarioStepNav({
  steps,
  activeStep,
  onChange,
}: {
  steps: { label: string; hint: string }[];
  activeStep: number;
  onChange: (step: number) => void;
}) {
  return (
    <div className="mb-6 grid gap-2 sm:grid-cols-3">
      {steps.map((step, index) => {
        const active = index === activeStep;
        return (
          <button
            key={step.label}
            type="button"
            onClick={() => onChange(index)}
            className={cn(
              "rounded-xl border px-4 py-3 text-left transition",
              active
                ? "border-[#030A27] bg-[#030A27] text-white"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            )}
          >
            <span
              className={cn(
                "text-xs font-medium",
                active ? "text-white/70" : "text-slate-400"
              )}
            >
              {index + 1}
            </span>
            <span className="mt-1 block text-sm font-semibold">{step.label}</span>
            <span
              className={cn(
                "mt-1 block text-xs leading-snug",
                active ? "text-white/80" : "text-slate-500"
              )}
            >
              {step.hint}
            </span>
          </button>
        );
      })}
    </div>
  );
}
