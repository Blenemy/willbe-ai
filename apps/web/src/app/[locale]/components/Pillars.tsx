import { getLocale, getTranslations } from "next-intl/server";
import { ArrowRight, ChartColumn, Check, MessagesSquare, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LeadsVisual } from "./visuals/LeadsVisual";
import { ProspectingVisual } from "./visuals/ProspectingVisual";
import { AnalyticsVisual } from "./visuals/AnalyticsVisual";

const PILLARS = [
  { key: "leads", icon: Users, Visual: LeadsVisual },
  { key: "prospecting", icon: MessagesSquare, Visual: ProspectingVisual },
  { key: "analytics", icon: ChartColumn, Visual: AnalyticsVisual },
] as const;

const POINTS = ["a", "b", "c"] as const;

export const Pillars = async () => {
  const t = await getTranslations("homepage.pillars");
  const locale = await getLocale();

  return (
    <section className="overflow-hidden bg-gradient-to-b from-[#030A27] via-[#061238] to-[#030A27] px-4 py-24">
      <div className="mx-auto flex max-w-6xl flex-col gap-24 sm:gap-32">
        {PILLARS.map(({ key, icon: Icon, Visual }, index) => (
          <article
            id={key}
            key={key}
            className="grid scroll-mt-24 items-center gap-12 lg:grid-cols-2 lg:gap-16"
          >
            <div className={index % 2 === 1 ? "lg:order-last" : undefined}>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-sm text-sky-200">
                <Icon className="size-4" />
                {t(`${key}.label`)}
              </span>
              <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                {t(`${key}.title`)}
              </h2>
              <p className="mt-4 text-pretty text-blue-100/70">{t(`${key}.text`)}</p>

              <ul className="mt-6 space-y-3">
                {POINTS.map((point) => (
                  <li key={point} className="flex gap-3 text-blue-100/90">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-sky-400/15 text-sky-300">
                      <Check className="size-3.5" />
                    </span>
                    {t(`${key}.points.${point}`)}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
                <div>
                  <p className="bg-gradient-to-r from-cyan-200 to-blue-400 bg-clip-text text-4xl font-semibold text-transparent">
                    {t(`${key}.stat_value`)}
                  </p>
                  <p className="text-sm text-blue-100/60">{t(`${key}.stat_label`)}</p>
                </div>
                <Button
                  asChild
                  className="rounded-full bg-white px-6 text-[#030A27] hover:bg-white/90"
                >
                  <Link href={`/${locale}/sign-in`}>
                    {t("cta")}
                    <ArrowRight />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <div aria-hidden className="absolute -inset-6 rounded-[2rem] bg-sky-500/10 blur-3xl" />
              <div className="relative">
                <Visual />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
