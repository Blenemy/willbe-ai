import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Languages, Mail, Send, Sparkles } from "lucide-react";
import linkedinIcon from "@/assets/linkedin.svg";

const MESSAGE = {
  subject: "La vostra espansione a Milano",
  body: "Ciao Marco, complimenti per l'apertura dell'ufficio di Milano il mese scorso. Chi entra in un nuovo mercato di solito ha bisogno di una pipeline calda prima che parta la prima assunzione. Ti va una chiamata di 15 minuti la prossima settimana?",
  linkedin:
    "Marco, ho letto il tuo post sulle assunzioni in Italia. Mi farebbe piacere entrare in contatto.",
};

export const ProspectingVisual = async () => {
  const t = await getTranslations("homepage.visuals");

  return (
    <div className="relative space-y-4">
      <div className="rounded-2xl border border-white/20 bg-white p-4 text-[#030A27] shadow-2xl shadow-sky-950/50 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex gap-1 rounded-lg bg-slate-100 p-1 text-xs">
            <span className="flex items-center gap-1.5 rounded-md bg-white px-2.5 py-1 font-medium shadow-sm">
              <Mail className="size-3.5" />
              {t("email")}
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 text-slate-500">
              <Image src={linkedinIcon} alt="" width={14} height={14} />
              {t("linkedin")}
            </span>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
            <Languages className="size-3" />
            {t("language")}
          </span>
        </div>

        <p className="mt-4 flex items-center gap-1.5 text-xs text-sky-700">
          <Sparkles className="size-3.5" />
          {t("generated_for")}
        </p>
        <p className="mt-2 text-sm font-semibold">{MESSAGE.subject}</p>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{MESSAGE.body}</p>
        <div className="mt-4 flex justify-end">
          <span className="flex size-8 items-center justify-center rounded-lg bg-[#030A27] text-white">
            <Send className="size-3.5" />
          </span>
        </div>
      </div>

      <div className="ml-auto max-w-sm rounded-2xl rounded-br-sm border border-white/15 bg-[#0B1B4D] p-4 text-sm text-white shadow-xl">
        <p className="flex items-center gap-2 text-xs text-sky-200">
          <Image src={linkedinIcon} alt="" width={14} height={14} />
          {t("linkedin")}
        </p>
        <p className="mt-2 leading-relaxed text-white/85">{MESSAGE.linkedin}</p>
      </div>
    </div>
  );
};
