"use client";

import CustomStepper from "@/components/Stepper/Stepper";
import { useState } from "react";
import CreateMessageForm from "./components/CreateMessageForm";
import { useParams } from "next/navigation";

const CreateMessageScenario = () => {
  const [activeStep, setActiveStep] = useState(0);
  const params = useParams();
  const id = params?.id as string;

  return (
    <div className="w-full px-6 py-10 flex flex-col">
      <h2 className="mb-5 font-semibold text-2xl">Create message scenarios</h2>

      <CustomStepper
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        steps={["Import leads", "Message campaign", "Statistics"]}
        disabled={!id}
      />

      <CreateMessageForm />
    </div>
  );
};

export default CreateMessageScenario;
