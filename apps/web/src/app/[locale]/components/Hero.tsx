import { getLocale, getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DashboardPreview } from "./visuals/DashboardPreview";

const STATS = ["contacts", "pipeline", "time"] as const;

export const Hero = async () => {
  const t = await getTranslations("homepage.hero");
  const locale = await getLocale();

  return (
    <section className="relative overflow-hidden px-4 pb-24 pt-16 sm:pt-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[720px] bg-[radial-gradient(55%_60%_at_50%_0%,rgba(56,189,248,0.22),transparent)]"
      />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center">
        <span className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-1 text-xs font-medium uppercase tracking-[0.2em] text-cyan-200">
          {t("eyebrow")}
        </span>
        <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
          {t("title")}
        </h1>
        <p className="mt-4 text-balance bg-gradient-to-r from-cyan-200 via-sky-300 to-blue-400 bg-clip-text text-2xl font-semibold text-transparent sm:text-3xl">
          {t("title_accent")}
        </p>
        <p className="mt-6 max-w-2xl text-pretty text-base text-blue-100/70 sm:text-lg">
          {t("subtitle")}
        </p>

        <div className="mt-10 grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
          {STATS.map((key) => (
            <div
              key={key}
              className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-left"
            >
              <p className="text-3xl font-semibold">{t(`stats.${key}.value`)}</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-blue-100/60">
                {t(`stats.${key}.label`)}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex w-full flex-col justify-center gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="rounded-full bg-white px-8 text-[#030A27] hover:bg-white/90"
          >
            <Link href={`/${locale}/sign-in`}>
              {t("cta_primary")}
              <ArrowRight />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-full border-white/20 bg-transparent px-8 text-white hover:bg-white/10 hover:text-white"
          >
            <Link href={`/${locale}/sign-in`}>{t("cta_secondary")}</Link>
          </Button>
        </div>
      </div>

      <div className="relative mx-auto mt-16 max-w-6xl">
        <div aria-hidden className="absolute -inset-4 rounded-[2rem] bg-sky-400/20 blur-3xl" />
        <DashboardPreview />
      </div>
    </section>
  );
};
