import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Clock, RefreshCw, Wallet } from "lucide-react";
import logo from "@/assets/logo_light.svg";
import hubspotLogo from "@/assets/hubspot_orange.svg";
import linkedinLogo from "@/assets/linkedin.svg";
import gmailLogo from "@/assets/gmail_logo.svg";
import microsoftLogo from "@/assets/MicrosoftLogo.svg";

const POINTS = [
  { key: "time", icon: Clock },
  { key: "cost", icon: Wallet },
  { key: "sync", icon: RefreshCw },
] as const;

const INTEGRATIONS = [
  { name: "HubSpot", logo: hubspotLogo, position: "left-1/2 top-0 -translate-x-1/2" },
  { name: "LinkedIn", logo: linkedinLogo, position: "right-0 top-1/2 -translate-y-1/2" },
  { name: "Gmail", logo: gmailLogo, position: "bottom-0 left-1/2 -translate-x-1/2" },
  { name: "Outlook", logo: microsoftLogo, position: "left-0 top-1/2 -translate-y-1/2" },
];

export const Integrations = async () => {
  const t = await getTranslations("homepage.crm");

  return (
    <section className="px-4 py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2">
        <div>
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-5 text-pretty text-blue-100/70">{t("text")}</p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {POINTS.map(({ key, icon: Icon }) => (
              <li
                key={key}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-blue-100/90"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-sky-400/10 text-sky-200">
                  <Icon className="size-4" />
                </span>
                {t(`points.${key}`)}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-sm sm:max-w-md">
          <div aria-hidden className="absolute inset-[13%] rounded-full border border-dashed border-white/20" />
          <div aria-hidden className="absolute inset-[28%] rounded-full bg-sky-500/25 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 flex size-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-[#0B1B4D] shadow-2xl shadow-sky-950 sm:size-32">
            <Image src={logo} alt="Willbe" width={72} height={29} />
          </div>
          {INTEGRATIONS.map(({ name, logo: integrationLogo, position }) => (
            <div
              key={name}
              className={`absolute flex w-24 flex-col items-center gap-2 rounded-2xl bg-white px-3 py-3 shadow-xl shadow-sky-950/50 ${position}`}
            >
              <Image src={integrationLogo} alt="" width={28} height={28} className="size-7 object-contain" />
              <span className="text-xs font-medium text-[#030A27]">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
