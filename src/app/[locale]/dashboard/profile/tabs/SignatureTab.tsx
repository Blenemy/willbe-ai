"use client";

import { useTranslations } from "next-intl";
import SignatureForm from "./components/SignatureForm";

const SignatureTab = () => {
  const t = useTranslations("Profile");

  return (
    <div className="px-6 flex flex-col gap-7">
      <h2 className="font-bold text-xl">{t("signature_title")}</h2>

      <SignatureForm />
    </div>
  );
};

export default SignatureTab;
