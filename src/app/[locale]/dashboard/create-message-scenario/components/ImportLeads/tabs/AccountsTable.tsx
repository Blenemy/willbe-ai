"use client";

import { useTranslations } from "next-intl";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ExternalLink } from "lucide-react";
import { useState } from "react";
import { CustomPagination } from "@/components/CustomPagination/CustomPagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { renderHeader } from "@/components/ui/renderHeader";
import {
  AccountRecord,
  AccountScenario,
  AccountScenarioData,
} from "@/hooks/useEditScenarioData";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";

interface Props {
  data: AccountScenario[] | AccountRecord[];
  selected: string[];
  setSelected: (val: string[]) => void;
}

type SortKey = "name" | "industry" | "headcount" | "location" | "summary" | "";

export const AccountsTable = ({ data, selected, setSelected }: Props) => {
  const t = useTranslations("messageScenarioData");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortKey, setSortKey] = useState<SortKey>("");
  const [sortAsc, setSortAsc] = useState(true);

  const toggleSelection = (id: string) => {
    //@ts-expect-error type string[] is not assignable to type string[]
    setSelected((prev: string[]): string[] => {
      return prev.includes(id)
        ? prev.filter((i: string) => i !== id)
        : [...prev, id];
    });
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc((prev) => !prev);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const filtered = data.filter((item) => {
    const acc =
      "accountData" in item.accountData
        ? item.accountData.accountData
        : item.accountData;

    return acc.name?.toLowerCase().includes(search.trim().toLowerCase());
  });

  const sorted = [...filtered].sort((a, b) => {
    if (!sortKey) return 0;

    const aInfo =
      "accountData" in a.accountData
        ? a.accountData.accountData
        : a.accountData;
    const bInfo =
      "accountData" in b.accountData
        ? b.accountData.accountData
        : b.accountData;

    const valA = aInfo[sortKey] || "";
    const valB = bInfo[sortKey] || "";

    return sortAsc
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  const selectedFirstSorted = [...sorted].sort((a, b) => {
    const aSelected = selected.includes(a.id);
    const bSelected = selected.includes(b.id);
    return aSelected === bSelected ? 0 : aSelected ? -1 : 1;
  });

  const paginated = selectedFirstSorted.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const currentPageIds = paginated.map((item) => item.id);

  const isAllSelectedOnPage = currentPageIds.every((id) =>
    selected.includes(id)
  );

  const handleToggleSelectAll = () => {
    if (isAllSelectedOnPage) {
      setSelected([]);
    } else {
      setSelected(paginated.map((scenario) => scenario.id));
    }
  };

  return (
    <>
      <Input
        placeholder={t("search.account")}
        className="mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px] align-middle">
              <div className="flex items-center justify-center h-6">
                <Checkbox
                  checked={isAllSelectedOnPage}
                  onCheckedChange={handleToggleSelectAll}
                />
              </div>
            </TableHead>
            {renderHeader(
              t("table.accountTitle"),
              "name",
              sortKey,
              sortAsc,
              handleSort
            )}
            {renderHeader(
              t("table.industry"),
              "industry",
              sortKey,
              sortAsc,
              handleSort
            )}
            {renderHeader(
              t("table.employees"),
              "headcount",
              sortKey,
              sortAsc,
              handleSort
            )}
            {renderHeader(
              t("table.location"),
              "location",
              sortKey,
              sortAsc,
              handleSort
            )}
            {renderHeader(
              t("table.description"),
              "summary",
              sortKey,
              sortAsc,
              handleSort
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.map((item) => {
            // @ts-expect-error createBy is missing
            const accInfo: AccountScenarioData =
              "accountData" in item.accountData
                ? item.accountData.accountData
                : item.accountData;

            return (
              <TableRow key={item.id}>
                <TableCell className="w-[40px] align-middle">
                  <div className="flex items-center justify-center h-6">
                    <Checkbox
                      checked={selected.includes(item.id)}
                      onCheckedChange={() => toggleSelection(item.id)}
                      aria-label="Select row"
                    />
                  </div>
                </TableCell>
                <TableCell className="max-w-[240px] break-words">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={accInfo.logo} />
                      <AvatarFallback>{accInfo.name?.[0]}</AvatarFallback>
                    </Avatar>
                    {accInfo.name}
                  </div>
                </TableCell>
                <TableCell className="max-w-[260px] break-words">
                  {accInfo.industry || "—"}
                </TableCell>
                <TableCell>{accInfo.headcount || "—"}</TableCell>
                <TableCell>{accInfo.location || "N/A"}</TableCell>
                <TableCell className="max-w-[300px] overflow-hidden text-ellipsis whitespace-nowrap text-sm text-muted-foreground">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          {accInfo.summary
                            ? accInfo.summary.slice(0, 100) +
                              (accInfo.summary.length > 100 ? "..." : "")
                            : "—"}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[400px] whitespace-pre-wrap">
                        {accInfo.summary}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell className="text-right w-[40px]">
                  <a
                    href={accInfo.profile_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between pt-4">
        <div className="text-sm flex gap-2 items-center">
          <span className="min-w-28">{t("dropdown.rowsPerPage")}</span>
          <Select onValueChange={(val) => setRowsPerPage(Number(val))}>
            <SelectTrigger className="w-16">
              <SelectValue placeholder={String(rowsPerPage)} />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20].map((v) => (
                <SelectItem key={v} value={String(v)}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <CustomPagination
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          totalCount={filtered.length}
        />
      </div>
    </>
  );
};
