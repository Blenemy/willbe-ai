import { getTranslations } from "next-intl/server";
import { ArrowUpRight, Check, CodeXml } from "lucide-react";
import { SOURCE_CODE_URL, TECH_STACK, WILLBE_PRODUCT_URL } from "@/constants/landing";

const MOCKS = ["linkedin", "email", "llm", "enrichment"] as const;

export const PortfolioEdition = async () => {
  const t = await getTranslations("homepage.portfolio");

  return (
    <section id="portfolio" className="scroll-mt-20 px-4 py-20 sm:py-24">
      <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-5">
        <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm sm:p-10 lg:col-span-3">
          <h2 className="text-balance text-3xl font-semibold tracking-tight">{t("title")}</h2>
          <p className="mt-4 text-pretty leading-relaxed text-[#5F5F5F]">{t("text")}</p>

          <h3 className="mt-8 text-sm font-semibold uppercase tracking-wider text-[#5F5F5F]">
            {t("mocks_title")}
          </h3>
          <ul className="mt-4 space-y-3">
            {MOCKS.map((key) => (
              <li key={key} className="flex gap-3 text-sm">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-teal-500/15 text-teal-700">
                  <Check className="size-3.5" />
                </span>
                <span>{t(`mocks.${key}`)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col justify-between gap-8 rounded-3xl bg-[#030A27] p-6 text-white sm:p-10 lg:col-span-2">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/60">
              {t("stack_title")}
            </h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {TECH_STACK.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-sm text-white/80"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <a
              href={SOURCE_CODE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 rounded-xl border border-white/15 px-4 py-3 text-sm transition-colors hover:bg-white/10"
            >
              <span className="flex items-center gap-3">
                <CodeXml className="size-4 text-teal-200" />
                {t("source")}
              </span>
              <ArrowUpRight className="size-4 text-white/60" />
            </a>
            <a
              href={WILLBE_PRODUCT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 rounded-xl bg-white px-4 py-3 text-sm font-medium text-[#030A27] transition-colors hover:bg-white/90"
            >
              {t("real")}
              <ArrowUpRight className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
