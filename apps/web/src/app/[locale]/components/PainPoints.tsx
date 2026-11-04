import { getTranslations } from "next-intl/server";
import { CircleHelp, ClipboardPen, Copy, Layers, Search } from "lucide-react";

const ITEMS = [
  { key: "tools", icon: Layers, tilt: "lg:-rotate-2" },
  { key: "crm", icon: ClipboardPen, tilt: "lg:rotate-1" },
  { key: "linkedin", icon: Search, tilt: "lg:-rotate-1" },
  { key: "clones", icon: Copy, tilt: "lg:rotate-2" },
  { key: "guessing", icon: CircleHelp, tilt: "lg:-rotate-1" },
] as const;

export const PainPoints = async () => {
  const t = await getTranslations("homepage.pain");

  return (
    <section className="px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-balance bg-gradient-to-b from-white to-sky-200/70 bg-clip-text text-center text-4xl font-semibold tracking-tight text-transparent sm:text-6xl">
          {t("title")}
        </h2>

        <ul className="mt-14 flex flex-wrap justify-center gap-4">
          {ITEMS.map(({ key, icon: Icon, tilt }) => (
            <li
              key={key}
              className={`flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.75rem)] ${tilt}`}
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-sky-400/10 text-sky-200">
                <Icon className="size-5" />
              </span>
              <span className="text-pretty text-blue-100/80">{t(`items.${key}`)}</span>
            </li>
          ))}
        </ul>

        <p className="mx-auto mt-16 max-w-2xl text-balance text-center text-2xl font-semibold sm:text-3xl">
          {t("outro")}
        </p>
      </div>
    </section>
  );
};
