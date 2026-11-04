import { getLocale, getTranslations } from "next-intl/server";

const FUNNEL = [
  { key: "sent", value: 1240, width: "w-full" },
  { key: "opened", value: 812, width: "w-[65%]" },
  { key: "replied", value: 310, width: "w-[25%]" },
  { key: "meetings", value: 96, width: "w-[8%]" },
] as const;

const WEEKS = [32, 45, 38, 52, 48, 61, 58, 70, 66, 78, 74, 90];

export const AnalyticsVisual = async () => {
  const t = await getTranslations("homepage.visuals");
  const locale = await getLocale();
  const format = new Intl.NumberFormat(locale);

  return (
    <div className="rounded-2xl border border-white/20 bg-white p-5 text-[#030A27] shadow-2xl shadow-sky-950/50">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold">{t("funnel")}</p>
        <span className="text-xs text-slate-500">{t("this_quarter")}</span>
      </div>

      <ul className="mt-5 space-y-3">
        {FUNNEL.map(({ key, value, width }) => (
          <li key={key}>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">{t(key)}</span>
              <span className="font-semibold">{format.format(value)}</span>
            </div>
            <div className="mt-1 h-2.5 rounded-full bg-slate-100">
              <div className={`h-2.5 rounded-full bg-gradient-to-r from-sky-300 to-blue-600 ${width}`} />
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex h-24 items-end gap-1.5 border-t border-slate-100 pt-4">
        {WEEKS.map((value, index) => (
          <div
            key={index}
            className="flex-1 rounded-t bg-sky-200 last:bg-blue-600"
            style={{ height: `${value}%` }}
          />
        ))}
      </div>
    </div>
  );
};
