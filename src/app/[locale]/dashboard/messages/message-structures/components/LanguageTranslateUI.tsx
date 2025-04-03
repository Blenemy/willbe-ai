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
  const [fromLang, setFromLang] = useState<string>();
  const [isTranslating, setIsTranslating] = useState(false);
  const { createTemplate } = useMessageTemplates();

  const handleTranslate = async () => {
    if (!fromLang) return;
    setIsTranslating(true);
    try {
      await createTemplate({
        language: currentLang,
        structureId,
        from: fromLang,
      });
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="border rounded p-4 space-y-4">
      <p>This template has not been created yet for this language.</p>
      <div className="space-y-2">
        <label className="font-medium">Translate from:</label>
        <Select onValueChange={setFromLang} value={fromLang}>
          <SelectTrigger>
            <SelectValue placeholder="Select source language" />
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
      <Button onClick={handleTranslate} disabled={!fromLang || isTranslating}>
        {isTranslating ? "Translating..." : "Translate"}
      </Button>
    </div>
  );
};
