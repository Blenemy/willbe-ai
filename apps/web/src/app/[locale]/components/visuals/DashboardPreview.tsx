import { getTranslations } from "next-intl/server";
import Image from "next/image";
import {
  Building2,
  ChartColumn,
  LayoutDashboard,
  Send,
  Settings,
  Users,
} from "lucide-react";
import logo from "@/assets/logo.svg";

const NAV = [
  { key: "home", icon: LayoutDashboard },
  { key: "accounts", icon: Building2 },
  { key: "leads", icon: Users },
  { key: "campaigns", icon: Send },
  { key: "analytics", icon: ChartColumn },
  { key: "settings", icon: Settings },
] as const;

const BARS = [
  { key: "sent", height: "h-24", color: "bg-slate-200" },
  { key: "replies", height: "h-14", color: "bg-sky-300" },
  { key: "meetings", height: "h-9", color: "bg-emerald-300" },
] as const;

const MEETINGS = [
  { name: "Laura Méndez", role: "Head of Sales", company: "Nordlicht", time: "10:30" },
  { name: "Marco Rossi", role: "Country Manager", company: "Vela Systems", time: "12:00" },
  { name: "Sophie Martin", role: "VP Marketing", company: "Lumen", time: "15:15" },
  { name: "David Klein", role: "CRO", company: "Brightpath", time: "17:00" },
];

export const DashboardPreview = async () => {
  const t = await getTranslations("homepage.preview");

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-1.5 shadow-2xl shadow-sky-950/60 sm:p-2">
      <div className="grid overflow-hidden rounded-xl bg-[#F5F7FB] text-[#030A27] md:grid-cols-[180px_1fr]">
        <aside className="hidden flex-col gap-1 border-r border-black/5 bg-white p-4 md:flex">
          <Image src={logo} alt="" width={70} height={28} className="mb-4" />
          {NAV.map(({ key, icon: Icon }, index) => (
            <span
              key={key}
              className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs ${
                index === 0 ? "bg-[#030A27] text-white" : "text-slate-500"
              }`}
            >
              <Icon className="size-3.5" />
              {t(key)}
            </span>
          ))}
        </aside>

        <div className="grid gap-3 p-3 sm:p-4 lg:grid-cols-3">
          <div className="rounded-xl bg-gradient-to-br from-[#0B2A6F] to-[#030A27] p-4 text-white lg:col-span-2">
            <p className="text-3xl font-semibold tracking-tight">11:23</p>
            <p className="mt-1 text-sm font-medium">{t("greeting")}</p>
            <p className="text-xs text-white/60">{t("date")}</p>
          </div>

          <div className="rounded-xl bg-white p-4">
            <p className="text-xs font-medium text-slate-500">{t("goal")}</p>
            <p className="mt-2 text-lg font-semibold">€42,500</p>
            <div className="mt-2 h-2 rounded-full bg-slate-100">
              <div className="h-2 w-[71%] rounded-full bg-gradient-to-r from-sky-400 to-blue-600" />
            </div>
            <p className="mt-1 text-right text-[10px] text-slate-400">€60,000</p>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:col-span-1 lg:grid-cols-1">
            <div className="rounded-xl bg-white p-4">
              <p className="text-xs font-medium text-slate-500">{t("meeting_rate")}</p>
              <p className="mt-1 text-2xl font-semibold">18%</p>
            </div>
            <div className="rounded-xl bg-white p-4">
              <p className="text-xs font-medium text-slate-500">{t("reply_rate")}</p>
              <p className="mt-1 text-2xl font-semibold">36%</p>
            </div>
          </div>

          <div className="hidden rounded-xl bg-white p-4 sm:block">
            <p className="text-xs font-medium text-slate-500">{t("performance")}</p>
            <div className="mt-3 flex h-32 items-end justify-around gap-3">
              {BARS.map(({ key, height, color }) => (
                <div key={key} className="flex flex-1 flex-col items-center gap-1">
                  <div className={`w-full max-w-10 rounded-md ${height} ${color}`} />
                  <span className="text-[10px] text-slate-500">{t(key)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden rounded-xl bg-white p-4 sm:block">
            <p className="text-xs font-medium text-slate-500">{t("upcoming")}</p>
            <ul className="mt-3 space-y-2.5">
              {MEETINGS.map(({ name, role, company, time }) => (
                <li key={name} className="flex items-center gap-2 text-[11px]">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-sky-100 text-[10px] font-semibold text-sky-700">
                    {name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </span>
                  <span className="min-w-0 flex-1 truncate">
                    <span className="font-medium">{name}</span>
                    <span className="text-slate-400">
                      {" "}
                      · {role}, {company}
                    </span>
                  </span>
                  <span className="text-slate-500">{time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
