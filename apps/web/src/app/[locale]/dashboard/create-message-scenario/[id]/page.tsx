"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CreateMessageForm from "../components/CreateMessageForm";
import { EditScenarioTables } from "../components/ImportLeads/EditScenariosTables";
import {
  useMessageScenarioById,
  usePostMessageScenarioLeads,
} from "@/hooks/useMessageScenarios";
import { useMessageCampaignEntries } from "@/hooks/useMessageCampaignEntries";
import { ScenarioMessageChain } from "../components/MessageCampaign/ScenarioMessageChain";
import { useTranslations } from "next-intl";
import { StatisticPage } from "../components/Statistics/StatisticPage";
import { useScenarioStepStore } from "@/store/useScenarioStepStore";
import { ScenarioStepNav } from "../components/ScenarioStepNav";

const EditMessageScenarioPage = () => {
  const t = useTranslations("messageScenario");
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const params = useParams();
  const id = params?.id as string;

  const { data: scenario } = useMessageScenarioById(id);
  const { data: messageEntries } = useMessageCampaignEntries(id);
  const { mutateAsync } = usePostMessageScenarioLeads();
  const { activeStep, setActiveStep, initStep } = useScenarioStepStore();

  useEffect(() => {
    if (messageEntries?.length && !selectedEntryId) {
      setSelectedEntryId(messageEntries[0].id);
    }
  }, [messageEntries, selectedEntryId]);

  const handleOnImport = async (selectedIds: string[]) => {
    await mutateAsync({ id, leadsIds: selectedIds });
    setActiveStep(1);
  };

  useEffect(() => {
    if (scenario) {
      initStep(scenario);
    }
  }, [scenario, initStep]);

  const steps = [
    { label: t("steps.import"), hint: t("stepHints.import") },
    { label: t("steps.campaign"), hint: t("stepHints.campaign") },
    { label: t("steps.stats"), hint: t("stepHints.stats") },
  ];

  return (
    <div className="w-full px-6 py-10 flex flex-col">
      <div className="mb-5">
        <h2 className="font-semibold text-2xl">
          {scenario?.name || t("editTitle")}
        </h2>
        <p className="mt-1 text-sm text-slate-500">{steps[activeStep]?.hint}</p>
      </div>

      <ScenarioStepNav
        steps={steps}
        activeStep={activeStep}
        onChange={setActiveStep}
      />

      {activeStep === 0 && (
        <>
          <CreateMessageForm defaultTitle={scenario?.name} id={id} />
          <EditScenarioTables onImport={handleOnImport} />
        </>
      )}
      {activeStep === 1 && scenario?.id && (
        <ScenarioMessageChain
          scenarioId={scenario.id}
          scenarioTitle={scenario.name}
        />
      )}

      {activeStep === 2 && <StatisticPage scenario={scenario} />}
    </div>
  );
};

export default EditMessageScenarioPage;
