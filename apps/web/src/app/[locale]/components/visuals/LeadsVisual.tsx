import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Search, SlidersHorizontal } from "lucide-react";
import linkedinIcon from "@/assets/linkedin.svg";

const LEADS = [
  { name: "Laura Méndez", role: "Head of Sales", company: "Nordlicht", tone: "bg-sky-100 text-sky-700" },
  { name: "Marco Rossi", role: "Country Manager", company: "Vela Systems", tone: "bg-emerald-100 text-emerald-700" },
  { name: "Sophie Martin", role: "VP Marketing", company: "Lumen", tone: "bg-amber-100 text-amber-700" },
  { name: "David Klein", role: "Chief Revenue Officer", company: "Brightpath", tone: "bg-violet-100 text-violet-700" },
  { name: "Ana Costa", role: "Sales Director", company: "Orbita", tone: "bg-rose-100 text-rose-700" },
];

const FILTERS = [
  { key: "job_title", value: "Head of Sales" },
  { key: "seniority", value: "Director+" },
  { key: "industry", value: "SaaS" },
  { key: "headcount", value: "51–200" },
] as const;

export const LeadsVisual = async () => {
  const t = await getTranslations("homepage.visuals");

  return (
    <div className="relative sm:pb-10 sm:pr-20">
      <div className="rounded-2xl border border-white/20 bg-white p-4 text-[#030A27] shadow-2xl shadow-sky-950/50">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold">{t("lead_list")}</p>
          <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-sky-700">
            {t("found")}
          </span>
        </div>
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-400">
          <Search className="size-3.5" />
          {t("search")}
        </div>
        <ul className="mt-2 divide-y divide-slate-100">
          {LEADS.map(({ name, role, company, tone }) => (
            <li key={name} className="flex items-center gap-3 py-2.5">
              <span
                className={`flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${tone}`}
              >
                {name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">{name}</span>
                <span className="block truncate text-xs text-slate-500">
                  {role} · {company}
                </span>
              </span>
              <Image src={linkedinIcon} alt="" width={18} height={18} />
            </li>
          ))}
        </ul>
      </div>

      <div className="relative mt-4 rounded-2xl border border-white/20 bg-[#0B1B4D] p-4 text-white shadow-2xl sm:absolute sm:bottom-0 sm:right-0 sm:mt-0 sm:w-60">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-200">
          <SlidersHorizontal className="size-3.5" />
          {t("filters")}
        </p>
        <dl className="mt-3 space-y-2">
          {FILTERS.map(({ key, value }) => (
            <div
              key={key}
              className="flex items-center justify-between gap-2 rounded-lg bg-white/5 px-2.5 py-1.5 text-xs"
            >
              <dt className="text-white/60">{t(key)}</dt>
              <dd className="font-medium">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
};
