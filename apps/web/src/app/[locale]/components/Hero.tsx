import { getLocale, getTranslations } from "next-intl/server";
import { ArrowRight, ArrowUpRight, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DEMO_CREDENTIALS, WILLBE_PRODUCT_URL } from "@/constants/landing";

const STATS = ["companies", "people", "channels", "languages"] as const;

export const Hero = async () => {
  const t = await getTranslations("homepage.hero");
  const locale = await getLocale();

  return (
    <section className="px-4 pt-6">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-[#030A27] px-5 py-16 text-white sm:px-12 sm:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-48 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(45,212,191,0.28),transparent)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-56 -right-32 h-[460px] w-[560px] rounded-full bg-[radial-gradient(closest-side,rgba(59,130,246,0.28),transparent)]"
        />

        <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
          <span className="rounded-full border border-teal-300/30 bg-teal-300/10 px-4 py-1 text-xs font-medium uppercase tracking-wider text-teal-200">
            {t("badge")}
          </span>
          <h1 className="mt-6 text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            {t("title")}
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-base text-white/70 sm:text-lg">
            {t("subtitle")}
          </p>

          <div className="mt-10 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="w-full bg-white text-[#030A27] hover:bg-white/90 sm:w-auto"
            >
              <Link href={`/${locale}/sign-in`}>
                {t("cta_demo")}
                <ArrowRight />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white sm:w-auto"
            >
              <a href={WILLBE_PRODUCT_URL} target="_blank" rel="noopener noreferrer">
                {t("cta_product")}
                <ArrowUpRight />
              </a>
            </Button>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">
            <KeyRound className="size-4 text-teal-200" />
            <span>{t("demo_label")}</span>
            <code className="font-[family-name:var(--font-geist-mono)] text-white">
              {DEMO_CREDENTIALS.email}
            </code>
            <span className="text-white/30">/</span>
            <code className="font-[family-name:var(--font-geist-mono)] text-white">
              {DEMO_CREDENTIALS.password}
            </code>
          </div>
        </div>

        <div className="relative mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-3 lg:grid-cols-4">
          {STATS.map((key) => (
            <div key={key} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-2xl font-semibold sm:text-3xl">{t(`stats.${key}.value`)}</p>
              <p className="mt-1 text-xs text-white/60 sm:text-sm">{t(`stats.${key}.label`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
