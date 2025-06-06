"use client";
import CreateMessageForm from "./components/CreateMessageForm";
import { useTranslations } from "next-intl";

const CreateMessageScenario = () => {
  const t = useTranslations("messageScenario");

  return (
    <div className="w-full px-6 py-10 flex flex-col">
      <h2 className="mb-5 font-semibold text-2xl">{t("createTitle")}</h2>

      <CreateMessageForm />
    </div>
  );
};

export default CreateMessageScenario;
