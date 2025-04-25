"use client";

import { Button } from "@/components/ui/button";
import { useStatisticsCsv } from "@/hooks/useStatisticsCsv";
import { useTranslations } from "next-intl";

interface Props {
  scenarioId: string | null;
}

export const ExportStatisticsCsvButtons = ({ scenarioId }: Props) => {
  const t = useTranslations("messageScenarioData");

  const { refetch: downloadCsv, isFetching: isCsvLoading } = useStatisticsCsv(
    scenarioId,
    false
  );

  const { refetch: downloadCsvWithEmails, isFetching: isCsvEmailsLoading } =
    useStatisticsCsv(scenarioId, true);

  const handleDownload = async (type: "normal" | "withEmails") => {
    if (!scenarioId) return;

    const res =
      type === "normal" ? await downloadCsv() : await downloadCsvWithEmails();

    if (res.data) {
      const link = document.createElement("a");
      link.href = res.data;
      link.download =
        type === "normal"
          ? "scenario_leads.csv"
          : "scenario_leads_with_emails.csv";
      link.click();
    }
  };

  return (
    <div className="flex gap-2 mt-4">
      <Button
        variant="outline"
        disabled={!scenarioId || isCsvLoading}
        onClick={() => handleDownload("normal")}
      >
        {t("exportCsv")}
      </Button>
      <Button
        variant="outline"
        disabled={!scenarioId || isCsvEmailsLoading}
        onClick={() => handleDownload("withEmails")}
      >
        {t("exportCsvWithEmails")}
      </Button>
    </div>
  );
};
