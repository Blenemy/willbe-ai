"use client";

import { Button } from "@/components/ui/button";
import { useDownloadMessageEntryCsv } from "@/hooks/useDownloadMessageEntryCsv";
import { useTranslations } from "next-intl";

interface Props {
  selectedEntryId: string | null;
}

export const ExportCsvButtons = ({ selectedEntryId }: Props) => {
  const t = useTranslations("messageChain");

  const { refetch: downloadCsv, isFetching: isCsvLoading } =
    useDownloadMessageEntryCsv(selectedEntryId, false);

  const { refetch: downloadCsvWithEmails, isFetching: isCsvEmailsLoading } =
    useDownloadMessageEntryCsv(selectedEntryId, true);

  const handleDownload = async (type: "normal" | "withEmails") => {
    if (!selectedEntryId) return;

    const res =
      type === "normal" ? await downloadCsv() : await downloadCsvWithEmails();

    if (res.data) {
      const link = document.createElement("a");
      link.href = res.data;
      link.download =
        type === "normal"
          ? "message_entry.csv"
          : "message_entry_with_emails.csv";
      link.click();
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        disabled={!selectedEntryId || isCsvLoading}
        type="button"
        onClick={() => handleDownload("normal")}
      >
        {t("exportCsv")}
      </Button>
      <Button
        variant="outline"
        disabled={!selectedEntryId || isCsvEmailsLoading}
        type="button"
        onClick={() => handleDownload("withEmails")}
      >
        {t("exportCsvWithEmails")}
      </Button>
    </div>
  );
};
