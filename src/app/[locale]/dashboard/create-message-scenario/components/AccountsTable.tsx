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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { AccountScenario } from "@/hooks/useEditScenarioData";
import { CustomPagination } from "@/components/CustomPagination/CustomPagination";

interface Props {
  data: AccountScenario[];
  selected: string[];
  setSelected: (ids: string[]) => void;
}

export const AccountsTable = ({ data, selected, setSelected }: Props) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  console.log(data);

  const toggleSelection = (id: string) => {
    setSelected(
      selected.includes(id)
        ? selected.filter((i) => i !== id)
        : [...selected, id]
    );
  };

  const filtered = data.filter((account) =>
    account.accountData?.accountData?.name
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  const reordered = [...filtered].sort((a, b) => {
    const aSelected = selected.includes(a.id);
    const bSelected = selected.includes(b.id);
    return aSelected === bSelected ? 0 : aSelected ? -1 : 1;
  });

  const paginated = reordered.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="w-full space-y-4">
      <Input
        placeholder="Search by account name"
        className="max-w-md"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead />
            <TableHead>Company</TableHead>
            <TableHead>Industry</TableHead>
            <TableHead>Employees</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.map((item) => {
            const acc = item.accountData.accountData;
            return (
              <TableRow key={item.id}>
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selected.includes(item.id)}
                    onChange={() => toggleSelection(item.id)}
                  />
                </TableCell>
                <TableCell>{acc?.name ?? "-"}</TableCell>
                <TableCell>{acc?.industry ?? "-"}</TableCell>
                <TableCell>{acc?.headcount ?? "-"}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between pt-4">
        <div className="text-sm flex items-center gap-2">
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
          totalCount={reordered.length}
        />
      </div>
    </div>
  );
};
