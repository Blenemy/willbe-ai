"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useSearchLeads } from "@/hooks/useSearchLeads";
import Image from "next/image";
import { useSavedLeads } from "@/hooks/useSavedLeads";
import { useTranslations } from "next-intl";
import { Spinner } from "@/components/Spinner/Spinner";
import { useQueryClient } from "@tanstack/react-query";
import linkedinImage from "@/assets/Linkedin.svg";
import linkedinYellowImage from "@/assets/linkedinYellow.svg";

const LeadTable = ({
  setCurrentStep,
  lastPageCursor,
}: {
  setCurrentStep: Dispatch<SetStateAction<number>>;
  lastPageCursor?: string;
}) => {
  const t = useTranslations("leadTable");

  const searchParams = useSearchParams();
  const scenarioId = searchParams.get("scenarioId") || "";
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [cursorStack, setCursorStack] = useState<(string | null)[]>([null]);
  const [currentCursorIndex, setCurrentCursorIndex] = useState(0);

  const { saveSelectedLeads } = useSavedLeads({
    enableFetch: true,
    scenarioId,
  });

  const currentCursor = cursorStack[currentCursorIndex];

  const { searchLeads, paging, cursor, isFetching } = useSearchLeads({
    enableFetch: true,
    scenarioId,
    limit: 30,
    cursor: currentCursor,
  });

  const totalPages = paging
    ? Math.ceil(paging.total_count / paging.page_count)
    : 1;

  const currentPage = paging
    ? Math.floor(paging.start / paging.page_count) + 1
    : 1;

  const toggleLeadSelection = (id: string) => {
    setSelectedLeads((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (cursor) {
      setCursorStack((prev) => [...prev, cursor]);
      setCurrentCursorIndex((prev) => prev + 1);
      queryClient.invalidateQueries({ queryKey: ["lead-scenarios-by-id"] });
    }
  };

  const handlePrev = () => {
    if (currentCursorIndex > 0) {
      setCurrentCursorIndex((prev) => prev - 1);
      queryClient.invalidateQueries({ queryKey: ["lead-scenarios-by-id"] });
    }
  };

  const filteredLeads = searchLeads.filter((lead) =>
    lead.first_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async () => {
    const selectedData = searchLeads.filter((item) =>
      selectedLeads.includes(item.id)
    );

    const payload = selectedData.map((lead) => ({
      type: lead.type,
      id: lead.id,
      industry: lead.industry,
      name: lead.name,
      first_name: lead.first_name,
      last_name: lead.last_name,
      member_urn: lead.member_urn,
      public_identifier: lead.public_identifier,
      public_profile_url: lead.public_profile_url,
      profile_url: lead.profile_url,
      profile_picture_url: lead.profile_picture_url,
      profile_picture_url_large: lead.profile_picture_url_large,
      network_distance: lead.network_distance,
      location: lead.location,
      headline: lead.headline,
      summary: lead.summary,
      pending_invitation: lead.pending_invitation,
      current_positions: lead.current_positions,
    }));

    await saveSelectedLeads({ scenarioId, leads: payload });
    setCurrentStep((prev) => prev + 1);
  };

  useEffect(() => {
    if (lastPageCursor) {
      setCursorStack([null, lastPageCursor]);
      setCurrentCursorIndex(1);
    }
  }, [lastPageCursor]);

  if (isFetching) {
    return <Spinner className="mr-2" />;
  }

  if (searchLeads && searchLeads.length === 0) {
    return <div>Leads not found</div>;
  }

  return (
    <div className="w-full px-6 py-10 flex flex-col gap-4">
      <h2 className="font-semibold text-2xl">{t("title")}</h2>

      {isFetching ? (
        <Spinner className="mr-2" />
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Input
              placeholder={t("searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentCursorIndex(0);
                setCursorStack([null]);
              }}
              className="max-w-md"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Checkbox
                    checked={
                      filteredLeads.length > 0 &&
                      filteredLeads.every((l) => selectedLeads.includes(l.id))
                    }
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedLeads((prev) => [
                          ...new Set([
                            ...prev,
                            ...filteredLeads.map((l) => l.id),
                          ]),
                        ]);
                      } else {
                        setSelectedLeads((prev) =>
                          prev.filter(
                            (id) => !filteredLeads.some((l) => l.id === id)
                          )
                        );
                      }
                    }}
                  />
                </TableHead>
                <TableHead>{t("table.avatar")}</TableHead>
                <TableHead>{t("table.firstName")}</TableHead>
                <TableHead>{t("table.lastName")}</TableHead>
                <TableHead>{t("table.jobTitle")}</TableHead>
                <TableHead>{t("table.location")}</TableHead>
                <TableHead>{t("table.company")}</TableHead>
                <TableHead>{t("table.linkedin")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedLeads.includes(lead.id)}
                      onCheckedChange={() => toggleLeadSelection(lead.id)}
                    />
                  </TableCell>
                  <TableCell>
                    {lead.profile_picture_url && (
                      <Image
                        src={lead.profile_picture_url}
                        alt={lead.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    )}
                  </TableCell>
                  <TableCell>{lead.first_name}</TableCell>
                  <TableCell>{lead.last_name}</TableCell>
                  <TableCell>
                    {lead.current_positions?.[0]?.role || "-"}
                  </TableCell>
                  <TableCell>{lead.location}</TableCell>
                  <TableCell>
                    {lead.current_positions?.[0]?.company || "-"}
                  </TableCell>
                  <TableCell>
                    {lead.public_profile_url && (
                      <a
                        href={lead.public_profile_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <Image
                          src={
                            lead.hasSalesNavigator
                              ? linkedinYellowImage
                              : linkedinImage
                          }
                          alt="LinkedIn"
                          width={16}
                          height={16}
                        />
                      </a>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center gap-4 mt-6">
            <Button onClick={handlePrev} disabled={currentCursorIndex === 0}>
              {t("pagination.previous")}
            </Button>
            <span>
              {t("pagination.pageInfo", {
                current: currentPage,
                total: totalPages,
              })}
            </span>
            <Button onClick={handleNext} disabled={!cursor}>
              {t("pagination.next")}
            </Button>
          </div>

          <Button
            className="self-start mt-4"
            onClick={handleSubmit}
            disabled={selectedLeads.length === 0}
          >
            {t("submit")}
          </Button>
        </div>
      )}
    </div>
  );
};

export default LeadTable;
