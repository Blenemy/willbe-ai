"use client";

import { useTranslations } from "next-intl";
import {
  Table,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useMemo } from "react";
import { LeadScenario } from "@/hooks/useEditScenarioData";
import { CustomPagination } from "@/components/CustomPagination/CustomPagination";
import { renderHeader } from "@/components/ui/renderHeader";
import { Checkbox } from "@/components/ui/checkbox";

interface Props {
  data: LeadScenario[];
  selected: string[];
  setSelected: (val: string[] | ((prev: string[]) => string[])) => void;
}

type SortKey = "name" | "createdBy" | "createdAt" | "";

export const LeadScenariosTable = ({ data, selected, setSelected }: Props) => {
  const t = useTranslations("messageScenarioData");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("");
  const [sortAsc, setSortAsc] = useState(true);

  const toggleSelection = (id: string) => {
    setSelected(
      selected.includes(id)
        ? selected.filter((i) => i !== id)
        : [...selected, id]
    );
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc((prev) => !prev);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const filtered = useMemo(() => {
    return data
      .filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => {
        if (sortKey === "name") {
          return sortAsc
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        }
        if (sortKey === "createdBy") {
          const fullNameA = `${a.user.firstName} ${a.user.lastName}`;
          const fullNameB = `${b.user.firstName} ${b.user.lastName}`;
          return sortAsc
            ? fullNameA.localeCompare(fullNameB)
            : fullNameB.localeCompare(fullNameA);
        }
        if (sortKey === "createdAt") {
          return sortAsc
            ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }

        return 0;
      });
  }, [data, search, sortKey, sortAsc]);

  const paginated = useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  const currentPageIds = paginated.map((item) => item.id);

  const isAllSelectedOnPage = currentPageIds.every((id) =>
    selected.includes(id)
  );

  const handleToggleSelectAll = () => {
    if (isAllSelectedOnPage) {
      setSelected((prev) => prev.filter((id) => !currentPageIds.includes(id)));
    } else {
      setSelected((prev) => [
        ...prev,
        ...currentPageIds.filter((id) => !prev.includes(id)),
      ]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder={t("search.scenario")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
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
            {renderHeader(
              t("table.scenarioTitle"),
              "name",
              sortKey,
              sortAsc,
              handleSort
            )}
            {renderHeader(
              t("table.createdBy"),
              "createdBy",
              sortKey,
              sortAsc,
              handleSort
            )}
            {renderHeader(
              t("table.createdAt"),
              "createdAt",
              sortKey,
              sortAsc,
              handleSort
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.map((s) => (
            <TableRow key={s.id}>
              <TableCell className="w-[40px] align-middle">
                <div className="flex items-center justify-center h-6">
                  <Checkbox
                    checked={selected.includes(s.id)}
                    onCheckedChange={() => toggleSelection(s.id)}
                    aria-label="Select row"
                  />
                </div>
              </TableCell>
              <TableCell className="max-w-[260px] break-words">
                {s.name}
              </TableCell>
              <TableCell className="max-w-[240px] break-words">
                {s.user.firstName} {s.user.lastName}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {new Date(s.createdAt).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between pt-4">
        <div className="text-sm flex gap-2 items-center">
          <span className="min-w-28">{t("dropdown.rowsPerPage")}</span>
          <Select
            value={String(rowsPerPage)}
            onValueChange={(val) => {
              setRowsPerPage(Number(val));
              setPage(0);
            }}
          >
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
    </div>
  );
};
