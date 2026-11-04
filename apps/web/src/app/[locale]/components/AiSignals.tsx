import { getTranslations } from "next-intl/server";
import { ArrowRight, Building2, Globe, Sparkles, UserRound } from "lucide-react";

const GROUPS = [
  {
    key: "person",
    icon: UserRound,
    signals: ["personality", "posts", "role", "interests", "education"],
  },
  {
    key: "company",
    icon: Building2,
    signals: ["industry", "employees", "vacancies", "events", "news"],
  },
  {
    key: "context",
    icon: Globe,
    signals: ["language", "location", "services", "calendar", "channel"],
  },
] as const;

export const AiSignals = async () => {
  const t = await getTranslations("homepage.ai");

  return (
    <section
      id="ai"
      className="scroll-mt-24 overflow-hidden bg-gradient-to-b from-[#030A27] via-[#071747] to-[#030A27] px-4 py-24"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-200">
            {t("eyebrow")}
          </p>
          <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-5 text-pretty text-blue-100/70">{t("text")}</p>
        </div>

        <div className="mt-14 grid items-center gap-6 lg:grid-cols-[1fr_auto_1fr]">
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1">
            {GROUPS.map(({ key, icon: Icon, signals }) => (
              <div key={key} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="flex items-center gap-2 text-sm font-medium text-sky-200">
                  <Icon className="size-4" />
                  {t(`groups.${key}`)}
                </p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {signals.map((signal) => (
                    <li
                      key={signal}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-blue-100/80"
                    >
                      {t(`signals.${signal}`)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div aria-hidden className="flex justify-center text-sky-300">
            <ArrowRight className="size-8 rotate-90 lg:rotate-0" />
          </div>

          <div className="rounded-2xl border border-white/20 bg-white p-6 text-[#030A27] shadow-2xl shadow-sky-950/50">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-700">
              <Sparkles className="size-4" />
              {t("result_title")}
            </p>
            <p className="mt-4 text-pretty leading-relaxed text-slate-700">{t("result_text")}</p>
            <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-4">
              <span className="flex size-9 items-center justify-center rounded-full bg-sky-100 text-xs font-semibold text-sky-700">
                LM
              </span>
              <span className="text-sm">
                <span className="block font-medium">Laura Méndez</span>
                <span className="block text-xs text-slate-500">Head of Sales · Nordlicht</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
