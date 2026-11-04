import { getTranslations } from "next-intl/server";

const STEPS = ["market", "people", "write", "track"] as const;

export const Steps = async () => {
  const t = await getTranslations("homepage.steps");

  return (
    <section id="how-it-works" className="scroll-mt-20 border-y border-black/5 bg-white px-4 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          {t("title")}
        </h2>

        <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {STEPS.map((key, index) => (
            <li key={key} className="relative">
              <div className="flex items-center gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[#030A27]/15 font-[family-name:var(--font-geist-mono)] text-sm font-medium">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {index < STEPS.length - 1 && (
                  <span aria-hidden className="hidden h-px flex-1 bg-gradient-to-r from-teal-400/60 to-transparent lg:block" />
                )}
              </div>
              <h3 className="mt-5 text-lg font-semibold">{t(`items.${key}.title`)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#5F5F5F]">{t(`items.${key}.text`)}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};
