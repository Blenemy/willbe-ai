"use client";

import CustomStepper from "@/components/Stepper/Stepper";
import { useParams } from "next/navigation";
import CreateMessageForm from "../components/CreateMessageForm";
import { useState } from "react";
import {
  useMessageScenarioById,
  usePostMessageScenarioLeads,
} from "@/hooks/useMessageScenarios";
import { EditScenarioTables } from "../components/EditScenariosTables";

const EditMessageScenarioPage = () => {
  const [activeStep, setActiveStep] = useState(0);

  const params = useParams();
  const id = params?.id as string;

  const { data: scenario } = useMessageScenarioById(id);
  const { mutate } = usePostMessageScenarioLeads();

  const handleOnImport = async (selectedIds: string[]) => {
    await mutate({ id, leadsIds: selectedIds });
    setActiveStep(1);
  };

  return (
    <div className="w-full px-6 py-10 flex flex-col">
      <h2 className="mb-5 font-semibold text-2xl">Edit message scenarios</h2>

      <CustomStepper
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        steps={["Import leads", "Message campaign", "Statistics"]}
        disabled={!id}
      />

      <CreateMessageForm defaultTitle={scenario?.name} id={id} />

      <EditScenarioTables onImport={handleOnImport} />
    </div>
  );
};

export default EditMessageScenarioPage;
