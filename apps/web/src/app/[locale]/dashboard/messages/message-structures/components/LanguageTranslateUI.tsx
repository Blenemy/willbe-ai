import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMessageTemplates } from "@/hooks/useMessageTemplates";
import { useTranslations } from "next-intl";

interface Props {
  currentLang: string;
  availableLangs: string[];
  structureId: string;
  handleLanguageChange: (lang: string, _: boolean) => void;
}

export const LanguageTranslateUI = ({
  currentLang,
  availableLangs,
  structureId,
  handleLanguageChange,
}: Props) => {
  const t = useTranslations("MessageStructures");
  const [fromLang, setFromLang] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const { createTemplate } = useMessageTemplates();

  const handleTranslate = async () => {
    if (!fromLang) return;
    setIsLoading(true);
    try {
      await createTemplate({
        language: currentLang,
        structureId,
        from: fromLang,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateFromScratch = () => {
    handleLanguageChange(currentLang, true);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">{t("template_not_created")}</p>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="flex flex-col justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-800">
            {t("create_from_scratch")}
          </p>
          <Button
            variant="outline"
            className="bg-white"
            onClick={handleCreateFromScratch}
            disabled={isLoading}
          >
            {isLoading ? t("creating") : t("create_from_scratch")}
          </Button>
        </div>

        <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <label className="text-sm font-medium text-slate-800">
            {t("translate_from_label")}
          </label>
          <Select onValueChange={setFromLang} value={fromLang}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder={t("select_source_language")} />
            </SelectTrigger>
            <SelectContent>
              {availableLangs.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            className="bg-[#030A27]"
            onClick={handleTranslate}
            disabled={!fromLang || isLoading}
          >
            {isLoading ? t("translating") : t("translate")}
          </Button>
        </div>
      </div>
    </div>
  );
};
