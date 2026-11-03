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
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSavedAccounts } from "@/hooks/useSavedAccounts";
import { useGenerateLeadScenario } from "@/hooks/useGenerateLeadScenario";
import { useTranslations } from "next-intl";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import linkedinImage from "@/assets/LinkedinLogo.svg";
import { renderCompactHeader } from "@/components/ui/renderHeader";
import { CustomPagination } from "@/components/CustomPagination/CustomPagination";
import { parseHeadcount } from "@/utils/parsedHeadcount";

const ROWS_PER_PAGE = 30;

const AccountSave = () => {
  const t = useTranslations("accountSave");
  const [sortKey, setSortKey] = useState<string>("title");
  const [page, setPage] = useState(0);
  const [sortAsc, setSortAsc] = useState<boolean>(true);

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

  const handleSort = (key: string) => {
    if (sortKey === key) setSortAsc((prev) => !prev);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const sortedAccounts = (savedAccounts ?? []).sort((a, b) => {
    // @ts-expect-error element implicitly has an "any" type
    const aVal = a.accountData?.[sortKey] ?? "";
    // @ts-expect-error element implicitly has an "any" type
    const bVal = b.accountData?.[sortKey] ?? "";

    if (sortKey === "headcount") {
      const numA = parseHeadcount(String(aVal));
      const numB = parseHeadcount(String(bVal));
      return sortAsc ? numA - numB : numB - numA;
    }

    return sortAsc
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });

  const handleDelete = async () => {
    deleteSavedAccounts(selectedIds);
    setSelectedIds([]);
  };

  const handleGenerateScenario = () => {
    generateLeadScenario({
      accountScenarioId: accountId,
      accountIds: selectedIds,
    });
  };

  const paginatedAccounts = sortedAccounts.slice(
    page * ROWS_PER_PAGE,
    (page + 1) * ROWS_PER_PAGE
  );

  if (savedAccounts && savedAccounts.length === 0) {
    return null;
  }

  return (
    <div className="w-full px-6 py-10 flex flex-col gap-4">
      <div className="flex justify-between">
        <h2 className="text-2xl font-semibold">{t("title")}</h2>

        <Button
          variant="destructive"
          disabled={selectedIds.length === 0}
          onClick={handleDelete}
        >
          {t("deleteSelected", { count: selectedIds.length })}
        </Button>
      </div>

      <Table className="table-fixed text-sm border-separate border-spacing-y-1 compact-table">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[36px] p-1">
              <Checkbox
                checked={
                  sortedAccounts.length > 0 &&
                  sortedAccounts.every((acc) => selectedIds.includes(acc.id))
                }
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedIds(sortedAccounts.map((acc) => acc.id));
                  } else {
                    setSelectedIds([]);
                  }
                }}
              />
            </TableHead>
            <TableHead className="w-[44px] p-1">{t("table.logo")}</TableHead>
            {renderCompactHeader(
              t("table.name"),
              "name",
              sortKey,
              sortAsc,
              handleSort
            )}
            {renderCompactHeader(
              t("table.industry"),
              "industry",
              sortKey,
              sortAsc,
              handleSort
            )}
            {renderCompactHeader(
              t("table.headcount"),
              "headcount",
              sortKey,
              sortAsc,
              handleSort
            )}
            <TableHead className="w-[90px] truncate">
              {t("table.linkedin")}
            </TableHead>
            <TableHead className="w-[320px] truncate hidden md:table-cell">
              {t("table.summary")}
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {paginatedAccounts.map((item) => {
            const data = item.accountData;
            return (
              <TableRow key={item.id}>
                <TableCell className="w-[36px] p-1">
                  <Checkbox
                    checked={selectedIds.includes(item.id)}
                    onCheckedChange={() => toggleSelection(item.id)}
                  />
                </TableCell>

                <TableCell className="w-[44px] p-1">
                  {data.logo && (
                    <Image
                      src={data.logo}
                      alt={data.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  )}
                </TableCell>

                <TableCell className="w-[120px] truncate">
                  {data.name}
                </TableCell>
                <TableCell className="w-[120px] truncate">
                  {data.industry}
                </TableCell>
                <TableCell className="w-[60px] truncate">
                  {data.headcount}
                </TableCell>

                <TableCell className="w-[90px] truncate">
                  {data.profile_url && (
                    <a
                      href={data.profile_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-[2px]"
                    >
                      <Image
                        src={linkedinImage}
                        alt="LinkedIn"
                        width={16}
                        height={16}
                      />
                    </a>
                  )}
                </TableCell>

                <TableCell className="w-[320px] truncate hidden md:table-cell">
                  <TooltipProvider delayDuration={200}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-help inline-block max-w-full truncate">
                          {data.summary?.slice(0, 120) + "..."}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
                        className="max-w-sm whitespace-pre-line break-words"
                      >
                        {data.summary}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between pt-4 flex-1">
        <CustomPagination
          page={page}
          setPage={setPage}
          rowsPerPage={ROWS_PER_PAGE}
          totalCount={sortedAccounts.length}
          disablePageJumping={false}
        />
      </div>

      <Button
        className="self-center mt-4"
        onClick={handleGenerateScenario}
        disabled={selectedIds.length === 0}
      >
        {t("generateScenario")}
      </Button>
    </div>
  );
};

export default AccountSave;
