import { getLocale, getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const FinalCta = async () => {
  const t = await getTranslations("homepage.cta");
  const locale = await getLocale();

  return (
    <section className="px-4 py-24">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0B2A6F] via-[#0A1E55] to-[#030A27] px-6 py-16 text-center sm:px-12 sm:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(56,189,248,0.3),transparent)]"
        />
        <div className="relative mx-auto flex max-w-2xl flex-col items-center">
          <h2 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-pretty text-lg text-blue-100/70">{t("text")}</p>
          <Button
            asChild
            size="lg"
            className="mt-10 w-full rounded-full bg-white px-8 text-[#030A27] hover:bg-white/90 sm:w-auto"
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
