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
}

export const LanguageTranslateUI = ({
  currentLang,
  availableLangs,
  structureId,
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

  const handleCreateFromScratch = async () => {
    setIsLoading(true);
    try {
      await createTemplate({
        language: currentLang,
        structureId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border rounded p-4 space-y-4">
      <p>{t("template_not_created")}</p>

      <div className="flex flex-col gap-2">
        <Button
          variant="outline"
          onClick={handleCreateFromScratch}
          disabled={isLoading}
        >
          {isLoading ? t("creating") : t("create_from_scratch")}
        </Button>

        <div className="space-y-2">
          <label className="font-medium">{t("translate_from_label")}</label>
          <Select onValueChange={setFromLang} value={fromLang}>
            <SelectTrigger>
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
        </div>

        <Button onClick={handleTranslate} disabled={!fromLang || isLoading}>
          {isLoading ? t("translating") : t("translate")}
        </Button>
      </div>
    </div>
  );
};
