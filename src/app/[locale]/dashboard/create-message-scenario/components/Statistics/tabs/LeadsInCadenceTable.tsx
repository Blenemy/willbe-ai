"use client";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLeadsInCadence } from "@/hooks/useLeadsInCadence";
import { useParams } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { Edit, Loader2, Sparkles, Trash } from "lucide-react";
import { CustomPagination } from "@/components/CustomPagination/CustomPagination";
import { Input } from "@/components/ui/input";
import { renderHeader } from "@/components/ui/renderHeader";
import { useSearchLeadField } from "@/hooks/useLeadFieldSearch";
import { Button } from "@/components/ui/button";

type SortKey = "name" | "company" | "";

export const LeadsInCadenceTable = () => {
  const { id: scenarioId } = useParams();
  const {
    data = [],
    isLoading,
    error,
  } = useLeadsInCadence(scenarioId as string);
  const { mutate: searchField, isPending } = useSearchLeadField();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("in_cadence");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortKey, setSortKey] = useState<SortKey>("");
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc((prev) => !prev);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const filtered = useMemo(() => {
    return data.filter((item) => {
      const lead = item.lead.leadData;
      const fullName = `${lead.first_name} ${lead.last_name}`.toLowerCase();
      const matchesName = fullName.includes(search.trim().toLowerCase());
      const matchesStatus = item.status === statusFilter;
      return matchesName && matchesStatus;
    });
  }, [data, search, statusFilter]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const leadA = a.lead.leadData;
      const leadB = b.lead.leadData;

      const nameA = `${leadA.first_name} ${leadA.last_name}`;
      const nameB = `${leadB.first_name} ${leadB.last_name}`;
      const companyA = leadA.current_positions?.[0]?.company || "";
      const companyB = leadB.current_positions?.[0]?.company || "";

      const valA = sortKey === "name" ? nameA : companyA;
      const valB = sortKey === "name" ? nameB : companyB;

      return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });
  }, [filtered, sortKey, sortAsc]);

  const paginated = sorted.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <Input
          type="text"
          placeholder="Search by lead first name, last name"
          className="w-full max-w-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          value={statusFilter}
          onValueChange={(val) => setStatusFilter(val)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="in_cadence">In cadence</SelectItem>
            <SelectItem value="response">Response</SelectItem>
            <SelectItem value="meeting">Meeting</SelectItem>
            <SelectItem value="bounced">Bounced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]" />
            {renderHeader("Full Name", "name", sortKey, sortAsc, handleSort)}
            <TableHead>Phone</TableHead>
            {renderHeader("Account", "company", sortKey, sortAsc, handleSort)}
            <TableHead>Lead status</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading || error ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                {isLoading ? "Loading..." : "Failed to load leads"}
              </TableCell>
            </TableRow>
          ) : (
            paginated.map((item) => {
              const lead = item.lead.leadData;
              const fullName = `${lead.first_name} ${lead.last_name}`;
              const company = lead.current_positions?.[0]?.company ?? "-";

              return (
                <TableRow key={item.id}>
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Image
                      src={lead.profile_picture_url}
                      alt={fullName}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <span>{fullName}</span>
                  </TableCell>
                  <TableCell>{item.phone ?? "Type here..."}</TableCell>
                  <TableCell>{company}</TableCell>
                  <TableCell>
                    <Select defaultValue={item.status}>
                      <SelectTrigger className="w-[150px] border-none">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="in_cadence">In cadence</SelectItem>
                        <SelectItem value="response">Response</SelectItem>
                        <SelectItem value="meeting">Meeting</SelectItem>
                        <SelectItem value="bounced">Bounced</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="align-middle">
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                          searchField({ entryIds: [item.id], field: "phone" })
                        }
                      >
                        {isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Sparkles className="w-4 h-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="flex gap-2 justify-end">
                    <Edit className="w-4 h-4 cursor-pointer" />
                    <Trash className="w-4 h-4 text-red-500 cursor-pointer" />
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between pt-4">
        <div className="text-sm flex gap-2 items-center">
          <span className="min-w-28">Rows per page</span>
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
          totalCount={sorted.length}
          rowsPerPage={rowsPerPage}
        />
      </div>
    </div>
  );
};
