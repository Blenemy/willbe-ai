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
import { useSavedLeads } from "@/hooks/useSavedLeads";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useCreateMessageScenarioWithLeads } from "@/hooks/useCreateMessageScenarioWithLeads";

const LeadsSaved = () => {
  const t = useTranslations("leadsSaved");

  const searchParams = useSearchParams();
  const scenarioId = searchParams.get("scenarioId");
  const { savedLeads, deleteLead } = useSavedLeads({
    enableFetch: true,
    scenarioId,
  });

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { createMessageScenario } = useCreateMessageScenarioWithLeads();

  const handleGenerate = () => {
    if (!scenarioId) return;

    createMessageScenario({
      leadScenarioId: scenarioId,
      leadsIds: selectedIds,
    });
  };

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDelete = async (id: string) => {
    deleteLead(id);
  };

  const handleOpenProfile = (url: string) => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  return (
    <div className="w-full px-6 py-10 flex flex-col gap-4">
      <h2 className="text-2xl font-semibold">{t("title")}</h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>{t("table.avatar")}</TableHead>
            <TableHead>{t("table.fullName")}</TableHead>
            <TableHead>{t("table.headline")}</TableHead>
            <TableHead>{t("table.industry")}</TableHead>
            <TableHead>{t("table.location")}</TableHead>
            <TableHead>{t("table.company")}</TableHead>
            <TableHead>{t("table.linkedin")}</TableHead>
            <TableHead>{t("table.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {savedLeads?.map((item) => {
            const data = item.leadData;
            const fullName = `${data.first_name} ${data.last_name}`;
            const location = data.location || "-";
            const company = data.current_positions?.[0]?.company || "-";

            return (
              <TableRow key={item.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(item.id)}
                    onCheckedChange={() => toggleSelection(item.id)}
                  />
                </TableCell>

                <TableCell>
                  {data.profile_picture_url && (
                    <Image
                      src={data.profile_picture_url}
                      alt={fullName}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  )}
                </TableCell>

                <TableCell>{fullName}</TableCell>
                <TableCell className="max-w-[300px] whitespace-pre-line">
                  {data.headline}
                </TableCell>
                <TableCell>{data.industry || "-"}</TableCell>
                <TableCell>{location}</TableCell>
                <TableCell>{company}</TableCell>

                <TableCell>
                  {data.public_profile_url ? (
                    <a
                      href={data.public_profile_url}
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
                  <div className="flex gap-2 justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenProfile(data.public_profile_url)}
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
        <Button className="self-start mt-4" onClick={handleGenerate}>
          {t("generate")}
        </Button>
      )}
    </div>
  );
};

export default LeadsSaved;
