import { getTranslations } from "next-intl/server";
import {
  Building2,
  ChartColumn,
  MailCheck,
  MessagesSquare,
  Settings2,
  Users,
} from "lucide-react";

const FEATURES = [
  { key: "accounts", icon: Building2 },
  { key: "leads", icon: Users },
  { key: "campaigns", icon: MessagesSquare },
  { key: "enrichment", icon: MailCheck },
  { key: "tracking", icon: ChartColumn },
  { key: "workspace", icon: Settings2 },
] as const;

export const Features = async () => {
  const t = await getTranslations("homepage.features");

  return (
    <section id="features" className="scroll-mt-20 px-4 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-pretty text-[#5F5F5F]">{t("subtitle")}</p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ key, icon: Icon }) => (
            <article
              key={key}
              className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-[#030A27] text-teal-200">
                <Icon className="size-5" />
              </span>
              <h3 className="mt-5 text-lg font-semibold">{t(`items.${key}.title`)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#5F5F5F]">
                {t(`items.${key}.text`)}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
