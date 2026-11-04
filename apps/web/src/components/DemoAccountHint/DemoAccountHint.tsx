import { getTranslations } from "next-intl/server";
import { KeyRound } from "lucide-react";
import { DEMO_CREDENTIALS } from "@/constants/landing";

export const DemoAccountHint = async () => {
  const t = await getTranslations("demoAccount");

  return (
    <div className="w-full max-w-[457px] rounded-xl border border-[#030A27]/10 bg-white/90 p-4 text-sm shadow-sm backdrop-blur">
      <p className="flex items-center gap-2 font-medium text-[#030A27]">
        <KeyRound className="size-4" />
        {t("title")}
      </p>
      <p className="mt-1 text-[#5F5F5F]">{t("hint")}</p>
      <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
        <dt className="text-[#5F5F5F]">{t("email")}</dt>
        <dd className="font-[family-name:var(--font-geist-mono)] text-[#030A27]">
          {DEMO_CREDENTIALS.email}
        </dd>
        <dt className="text-[#5F5F5F]">{t("password")}</dt>
        <dd className="font-[family-name:var(--font-geist-mono)] text-[#030A27]">
          {DEMO_CREDENTIALS.password}
        </dd>
      </dl>
    </div>
  );
};
