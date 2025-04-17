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
import { CreateScenarioTable } from "../components/CreateScenarioTable";
import { useMessageCampaignEntries } from "@/hooks/useMessageCampaignEntries";

const mockLeads = [
  {
    id: "lead1",
    firstName: "John",
    lastName: "Doe",
    email: "",
    phone: "",
    role: "",
    accountId: "",
    messageStructureId: "",
    language: "",
    productOrServiceId: "",
    message: "",
  },
  {
    id: "lead2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane@example.com",
    phone: "123456789",
    role: "Manager",
    accountId: "",
    messageStructureId: "",
    language: "",
    productOrServiceId: "",
    message: "",
  },
];

const mockAccounts = [
  { id: "acc1", name: "Google" },
  { id: "acc2", name: "Meta" },
];

const mockMessageStructures = [
  { id: "ms1", name: "Cold Outreach", languages: ["en", "fr"] },
  { id: "ms2", name: "Follow-up", languages: ["en", "es"] },
];

const mockProducts = [
  { id: "prod1", name: "CRM System" },
  { id: "prod2", name: "Analytics Tool" },
];

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

  const { data: messageEntries } = useMessageCampaignEntries(id);

  console.log(messageEntries);

  return (
    <div className="w-full px-6 py-10 flex flex-col">
      <h2 className="mb-5 font-semibold text-2xl">Edit message scenarios</h2>

      <CustomStepper
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        steps={["Import leads", "Message campaign", "Statistics"]}
        disabled={!id}
      />

      {activeStep === 0 && (
        <>
          <CreateMessageForm defaultTitle={scenario?.name} id={id} />
          <EditScenarioTables onImport={handleOnImport} />
        </>
      )}

      {activeStep === 1 && (
        <CreateScenarioTable
          leads={mockLeads}
          accounts={mockAccounts}
          messageStructures={mockMessageStructures}
          products={mockProducts}
          onGenerate={() => console.log("Generate messages")}
          onSend={() => console.log("Send messages")}
        />
      )}
    </div>
  );
};

export default EditMessageScenarioPage;
