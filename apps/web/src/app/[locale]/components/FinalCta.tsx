import { getLocale, getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DEMO_CREDENTIALS } from "@/constants/landing";

export const FinalCta = async () => {
  const t = await getTranslations("homepage.cta");
  const locale = await getLocale();

  return (
    <section className="px-4 pb-20 sm:pb-24">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-[#030A27] px-5 py-14 text-center text-white sm:px-12">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/2 h-[360px] w-[640px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(45,212,191,0.25),transparent)]"
        />
        <div className="relative mx-auto flex max-w-2xl flex-col items-center">
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">{t("title")}</h2>
          <p className="mt-4 text-pretty text-white/70">{t("text")}</p>
          <p className="mt-6 font-[family-name:var(--font-geist-mono)] text-sm text-white/80">
            {DEMO_CREDENTIALS.email} / {DEMO_CREDENTIALS.password}
          </p>
          <Button
            asChild
            size="lg"
            className="mt-8 w-full bg-white text-[#030A27] hover:bg-white/90 sm:w-auto"
          >
            <Link href={`/${locale}/sign-in`}>
              {t("button")}
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
