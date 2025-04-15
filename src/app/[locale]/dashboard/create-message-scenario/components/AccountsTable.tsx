"use client";

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
import {
  AccountScenario,
  AccountScenarioData,
} from "@/hooks/useEditScenarioData";
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

interface Props {
  data: AccountScenario[];
  selected: string[];
  setSelected: (val: string[]) => void;
}

type SortKey = "name" | "industry" | "";

export const AccountsTable = ({ data, selected, setSelected }: Props) => {
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

    return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
  });

  const paginated = sorted.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <Input
        placeholder="Search by account title"
        className="mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]" />
            {renderHeader(
              "Account title",
              "name",
              sortKey,
              sortAsc,
              handleSort
            )}
            {renderHeader("Industry", "industry", sortKey, sortAsc, handleSort)}
            <TableHead className="w-[40px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.map((item) => {
            const accInfo: AccountScenarioData =
              "accountData" in item.accountData
                ? item.accountData.accountData
                : item.accountData;

            return (
              <TableRow key={item.id}>
                <TableCell className="w-[40px]">
                  <input
                    type="checkbox"
                    checked={selected.includes(item.id)}
                    onChange={() => toggleSelection(item.id)}
                  />
                </TableCell>
                <TableCell className="flex items-center gap-2 max-w-[240px] break-words">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={accInfo.logo} />
                    <AvatarFallback>{accInfo.name?.[0]}</AvatarFallback>
                  </Avatar>
                  {accInfo.name}
                </TableCell>
                <TableCell className="max-w-[260px] break-words">
                  {accInfo.industry || "—"}
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
          Rows per page:
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
