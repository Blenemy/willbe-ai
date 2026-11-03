"use client";

import CreateMessageForm from "./components/CreateMessageForm";
import { useTranslations } from "next-intl";

const CreateMessageScenario = () => {
  const t = useTranslations("messageScenario");
  const steps = [
    { label: t("steps.import"), hint: t("stepHints.import") },
    { label: t("steps.campaign"), hint: t("stepHints.campaign") },
    { label: t("steps.stats"), hint: t("stepHints.stats") },
  ];

  return (
    <div className="w-full px-6 py-10 flex flex-col gap-6">
      <div>
        <h2 className="font-semibold text-2xl">{t("createTitle")}</h2>
        <p className="mt-1 max-w-2xl text-sm text-slate-500">{t("setupHint")}</p>
      </div>

      <ol className="grid gap-2 sm:grid-cols-3">
        {steps.map((step, index) => (
          <li
            key={step.label}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
          >
            <span className="text-xs font-medium text-slate-400">{index + 1}</span>
            <span className="mt-1 block text-sm font-semibold text-slate-800">
              {step.label}
            </span>
            <span className="mt-1 block text-xs leading-snug text-slate-500">
              {step.hint}
            </span>
          </li>
        ))}
      </ol>

      <CreateMessageForm />
    </div>
  );
};

export default CreateMessageScenario;
