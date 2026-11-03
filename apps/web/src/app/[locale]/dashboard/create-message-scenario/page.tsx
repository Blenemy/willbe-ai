"use client";
import CustomStepper from "@/components/Stepper/Stepper";
import { useState } from "react";
import CreateMessageForm from "./components/CreateMessageForm";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

const CreateMessageScenario = () => {
  const t = useTranslations("messageScenario");
  const [activeStep, setActiveStep] = useState(0);
  const params = useParams();
  const id = params?.id as string;

  return (
    <div className="w-full px-6 py-10 flex flex-col">
      <h2 className="mb-5 font-semibold text-2xl">{t("createTitle")}</h2>
      <CustomStepper
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        steps={[t("steps.import"), t("steps.campaign"), t("steps.stats")]}
        disabled={!id}
        hideBackButton={true}
        hideNextButton={true}
      />
      <CreateMessageForm />
    </div>
  );
};

export default CreateMessageScenario;
