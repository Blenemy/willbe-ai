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
import { useGenerateLeadScenario } from "@/hooks/useGenerateLeadScenario";
import { useSavedLeads } from "@/hooks/useSavedLeads";
import Image from "next/image";

const LeadsSaved = () => {
  const searchParams = useSearchParams();
  const scenarioId = searchParams.get("scenarioId");
  const { savedLeads, deleteLead } = useSavedLeads({
    enableFetch: true,
    scenarioId,
  });

  const { generateLeadScenario } = useGenerateLeadScenario();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

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

  const handleGenerateScenario = () => {
    generateLeadScenario({
      accountScenarioId: scenarioId,
      accountIds: selectedIds,
    });
  };

  return (
    <div className="w-full px-6 py-10 flex flex-col gap-4">
      <h2 className="text-2xl font-semibold">Saved Leads</h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>Avatar</TableHead>
            <TableHead>Full Name</TableHead>
            <TableHead>Headline</TableHead>
            <TableHead>Industry</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>LinkedIn</TableHead>
            <TableHead>Actions</TableHead>
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
                      Open
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
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
          Generate message scenario
        </Button>
      )}
    </div>
  );
};

export default LeadsSaved;
