"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CustomStepper from "@/components/Stepper/Stepper";
import CreateMessageForm from "../components/CreateMessageForm";
import { EditScenarioTables } from "../components/EditScenariosTables";
import {
  useMessageScenarioById,
  usePostMessageScenarioLeads,
} from "@/hooks/useMessageScenarios";
import { useMessageCampaignEntries } from "@/hooks/useMessageCampaignEntries";
import { ScenarioMessageChain } from "../components/ScenarioMessageChain";
import { useTranslations } from "next-intl";

const EditMessageScenarioPage = () => {
  const t = useTranslations("messageScenario");
  const [activeStep, setActiveStep] = useState(0);
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const params = useParams();
  const id = params?.id as string;

  const { data: scenario } = useMessageScenarioById(id);
  const { data: messageEntries } = useMessageCampaignEntries(id);
  const { mutate } = usePostMessageScenarioLeads();

  useEffect(() => {
    if (messageEntries?.length && !selectedEntryId) {
      setSelectedEntryId(messageEntries[0].id);
    }
  }, [messageEntries, selectedEntryId]);

  const handleOnImport = async (selectedIds: string[]) => {
    await mutate({ id, leadsIds: selectedIds });
    setActiveStep(1);
  };

  return (
    <div className="w-full px-6 py-10 flex flex-col">
      <h2 className="mb-5 font-semibold text-2xl">{t("editTitle")}</h2>
      <CustomStepper
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        steps={[t("steps.import"), t("steps.campaign"), t("steps.stats")]}
        disabled={!id}
      />
      {activeStep === 0 && (
        <>
          <CreateMessageForm defaultTitle={scenario?.name} id={id} />
          <EditScenarioTables onImport={handleOnImport} />
        </>
      )}
      {activeStep === 1 && scenario?.id && (
        <ScenarioMessageChain scenarioId={scenario.id} />
      )}
    </div>
  );
};

export default EditMessageScenarioPage;
