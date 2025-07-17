"use client";

import { useTranslations } from "next-intl";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ExternalLink, ChevronUp, ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { Lead } from "@/hooks/useEditScenarioData";
import { CustomPagination } from "@/components/CustomPagination/CustomPagination";
import { Checkbox } from "@/components/ui/checkbox";
import {
  deselectCurrentPage,
  selectCurrentPage,
} from "./utils/selectionHelpers";

interface Props {
  data: Lead[];
  selected: string[];
  setSelected: (val: string[]) => void;
  onImport: (selectedIds: string[]) => Promise<void>;
}

type SortKey =
  | "first_name"
  | "last_name"
  | "email"
  | "headline"
  | "account"
  | "last_response";

type SelectionFilter = "all" | "selected" | "unselected";

export const LeadsTable = ({
  data,
  selected,
  setSelected,
  onImport,
}: Props) => {
  const t = useTranslations("messageScenarioData");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [selectionFilter, setSelectionFilter] =
    useState<SelectionFilter>("all");

  const toggleSelection = (id: string) => {
    setSelected(
      selected.includes(id)
        ? selected.filter((i) => i !== id)
        : [...selected, id]
    );
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc((prev) => !prev);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const getSortValue = (lead: Lead, key: SortKey): string => {
    switch (key) {
      case "first_name":
        return lead.leadData.first_name || "";
      case "last_name":
        return lead.leadData.last_name || "";
      case "email":
        return lead.leadData.profile_url || "";
      case "headline":
        return lead.leadData.headline || "";
      case "account":
        return lead.leadData.current_positions?.[0]?.company || "";
      case "last_response":
        return lead.updatedAt || "";
    }
  };

  const filtered = useMemo(() => {
    return data
      .filter((item) => {
        const fullName =
          `${item.leadData.first_name} ${item.leadData.last_name}`.toLowerCase();
        const email = item.leadData.profile_url?.toLowerCase();
        const headline = item.leadData.headline?.toLowerCase();
        return (
          fullName.includes(search.toLowerCase()) ||
          email?.includes(search.toLowerCase()) ||
          headline?.includes(search.toLowerCase())
        );
      })
      .filter((item) => {
        if (selectionFilter === "selected") return selected.includes(item.id);
        if (selectionFilter === "unselected")
          return !selected.includes(item.id);
        return true;
      })
      .sort((a, b) => {
        if (!sortKey) return 0;
        const aVal = getSortValue(a, sortKey);
        const bVal = getSortValue(b, sortKey);
        return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      });
  }, [data, selected, search, sortKey, sortAsc, selectionFilter]);

  const paginated = useMemo(
    () => filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filtered, page, rowsPerPage]
  );

  const currentPageIds = paginated.map((item) => item.id);

  const isAllSelectedOnPage = currentPageIds.every((id) =>
    selected.includes(id)
  );

  const handleToggleSelectAll = () => {
    if (isAllSelectedOnPage) {
      // @ts-expect-error correct types
      deselectCurrentPage(currentPageIds, setSelected);
    } else {
      // @ts-expect-error correct types
      selectCurrentPage(currentPageIds, setSelected);
    }
  };

  const renderHeader = (label: string, key: SortKey) => (
    <TableHead
      onClick={() => handleSort(key)}
      className="cursor-pointer select-none whitespace-nowrap"
    >
      <div className="flex items-center gap-1 min-w-[140px]">
        <div className="flex flex-col leading-none text-muted-foreground">
          {sortKey === key ? (
            sortAsc ? (
              <ChevronUp className="w-4 h-4 text-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-foreground" />
            )
          ) : (
            <div className="flex items-center">
              <ChevronUp className="w-4 h-4 p-0 -mr-1" />
              <ChevronDown className="w-4 h-4 p-0" />
            </div>
          )}
        </div>
        {label}
      </div>
    </TableHead>
  );

  const handleClick = () => onImport(selected);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder={t("search.lead")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          onValueChange={(val: SelectionFilter) => setSelectionFilter(val)}
          value={selectionFilter}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder={t("dropdown.selected")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("dropdown.all")}</SelectItem>
            <SelectItem value="selected">{t("dropdown.selected")}</SelectItem>
            <SelectItem value="unselected">
              {t("dropdown.unselected")}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

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
            {renderHeader(t("table.firstName"), "first_name")}
            {renderHeader(t("table.lastName"), "last_name")}
            {renderHeader(t("table.email"), "email")}
            {renderHeader(t("table.role"), "headline")}
            {renderHeader(t("table.account"), "account")}
            {renderHeader(t("table.lastResponse"), "last_response")}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.map((item) => (
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
              <TableCell className="break-words">
                {item.leadData.first_name}
              </TableCell>
              <TableCell className="break-words">
                {item.leadData.last_name}
              </TableCell>
              <TableCell className="max-w-[200px] break-words">
                {item.leadData.profile_url}
              </TableCell>
              <TableCell className="max-w-[250px] break-words">
                {item.leadData.headline}
              </TableCell>
              <TableCell className="break-words">
                {item.leadData.current_positions?.[0]?.company || "—"}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {new Date(item.updatedAt).toLocaleString("en-GB")}
              </TableCell>
              <TableCell className="text-right">
                <a
                  href={item.leadData.public_profile_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center">
        <div className="text-sm flex gap-2 flex-grow items-center">
          <p className="min-w-28">{t("dropdown.rowsPerPage")}</p>
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

      <div className="flex justify-end">
        <Button onClick={handleClick} disabled={selected.length === 0}>
          {t("buttons.import")}
        </Button>
      </div>
    </div>
  );
};
