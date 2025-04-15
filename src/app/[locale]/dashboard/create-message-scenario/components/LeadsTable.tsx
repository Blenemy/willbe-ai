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
import { useMemo, useState } from "react";
import { Lead } from "@/hooks/useEditScenarioData";
import { Button } from "@/components/ui/button";
import { CustomPagination } from "@/components/CustomPagination/CustomPagination";

interface Props {
  data: Lead[];
  selected: string[];
  setSelected: (val: string[]) => void;
  onImport: () => void;
}

export const LeadsTable = ({
  data,
  selected,
  setSelected,
  onImport,
}: Props) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return data.filter((item) => {
      const fullName =
        `${item.leadData.first_name} ${item.leadData.last_name}`.toLowerCase();
      return fullName.includes(search.toLowerCase());
    });
  }, [data, search]);

  const paginated = useMemo(
    () => filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filtered, page, rowsPerPage]
  );

  const toggle = (id: string) => {
    setSelected(
      selected.includes(id)
        ? selected.filter((i) => i !== id)
        : [...selected, id]
    );
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search by lead name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead />
            <TableHead>Name</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Headline</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <input
                  type="checkbox"
                  checked={selected.includes(item.id)}
                  onChange={() => toggle(item.id)}
                />
              </TableCell>
              <TableCell>
                {item.leadData.first_name} {item.leadData.last_name}
              </TableCell>
              <TableCell>{item.leadData.location}</TableCell>
              <TableCell>{item.leadData.headline}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center">
        <div className="text-sm flex gap-2 flex-grow items-center">
          <p className="min-w-28">Rows per page:</p>
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
        <Button onClick={onImport} disabled={selected.length === 0}>
          Import leads
        </Button>
      </div>
    </div>
  );
};
