"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ExternalLink } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSavedAccounts } from "@/hooks/useSavedAccounts";
import { useGenerateLeadScenario } from "@/hooks/useGenerateLeadScenario";
import { useTranslations } from "next-intl";

const AccountSave = () => {
  const t = useTranslations("accountSave");

  const searchParams = useSearchParams();
  const accountId = searchParams.get("accountId");
  const { savedAccounts, deleteSavedAccounts } = useSavedAccounts({
    enableFetch: true,
    accountId,
  });
  const { generateLeadScenario } = useGenerateLeadScenario();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDelete = async (id: string) => {
    deleteSavedAccounts(id);
  };

  const handleOpenProfile = (url: string) => {
    window.open(url, "_blank");
  };

  const handleGenerateScenario = () => {
    generateLeadScenario({
      accountScenarioId: accountId,
      accountIds: selectedIds,
    });
  };

  return (
    <div className="w-full px-6 py-10 flex flex-col gap-4">
      <h2 className="text-2xl font-semibold">{t("title")}</h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>{t("table.title")}</TableHead>
            <TableHead>{t("table.description")}</TableHead>
            <TableHead>{t("table.industry")}</TableHead>
            <TableHead>{t("table.employees")}</TableHead>
            <TableHead>{t("table.country")}</TableHead>
            <TableHead>{t("table.city")}</TableHead>
            <TableHead>{t("table.created")}</TableHead>
            <TableHead>{t("table.website")}</TableHead>
            <TableHead>{t("table.linkedin")}</TableHead>
            <TableHead>{t("table.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {savedAccounts?.map((item) => {
            const data = item.accountData;
            const [city, country] = data.location?.split(",") ?? ["-", "-"];
            return (
              <TableRow key={item.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(item.id)}
                    onCheckedChange={() => toggleSelection(item.id)}
                  />
                </TableCell>
                <TableCell>{data.name}</TableCell>
                <TableCell className="max-w-[300px] whitespace-pre-line">
                  {data.summary?.slice(0, 150)}...
                </TableCell>
                <TableCell>{data.industry}</TableCell>
                <TableCell>{data.headcount}</TableCell>
                <TableCell>{country}</TableCell>
                <TableCell>{city}</TableCell>
                <TableCell>{item.createdAt}</TableCell>
                <TableCell>
                  {data.website ? (
                    <a
                      href={data.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {t("table.website")}
                    </a>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>
                  {data.profile_url ? (
                    <a
                      href={data.profile_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <ExternalLink size={16} />
                    </a>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenProfile(data.profile_url)}
                    >
                      {t("table.open")}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                    >
                      {t("table.delete")}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {selectedIds.length > 0 && (
        <Button className="self-start mt-4" onClick={handleGenerateScenario}>
          {t("generateScenario")}
        </Button>
      )}
    </div>
  );
};

export default AccountSave;
