"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, Trash2, Plus } from "lucide-react";
import { CustomPagination } from "@/components/CustomPagination/CustomPagination";
import { useClientPagination } from "../hooks/useClientPagination";
import {
  AccountPageTableData,
  useAccountLeads,
  useDeleteLeads,
} from "@/hooks/useAccountLeads";
import { useParams, useRouter } from "next/navigation";
import { renderHeader } from "@/components/ui/renderHeader";
import { useLocale } from "next-intl";

type SortKey = "firstName" | "lastName" | "email" | "phone" | "role" | "";

export const LeadsTab = () => {
  const { id } = useParams();
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>("");
  const [sortAsc, setSortAsc] = useState(true);
  const router = useRouter();
  const locale = useLocale();

  const { data: leads = [] } = useAccountLeads({
    accountId: id as string,
    search,
    limit: 100,
    offset: 0,
  });
  const { mutate: deleteLeads } = useDeleteLeads();

  const { paginated, page, setPage, rowsPerPage, setRowsPerPage, totalCount } =
    useClientPagination<AccountPageTableData>({
      data: leads,
      search,
      sortKey,
      sortAsc,
    });

  const isAllSelected =
    paginated.length > 0 && selectedIds.length === paginated.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginated.map((lead) => lead.id));
    }
  };

  const toggleSelectRow = (id: string, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((item) => item !== id)
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

  return (
    <div className="space-y-4 mt-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/3"
        />
        <div className="flex gap-2">
          <Button
            variant="destructive"
            disabled={selectedIds.length === 0}
            onClick={() => deleteLeads({ leadIds: selectedIds })}
          >
            Delete selected
          </Button>
          <Button
            onClick={() =>
              router.push(
                `/${locale}/dashboard/lead-page/new-lead?accountId=${id}`
              )
            }
          >
            <Plus className="w-4 h-4 mr-2" />
            Add lead
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={toggleSelectAll}
              />
            </TableHead>
            {renderHeader(
              "First name",
              "firstName",
              sortKey,
              sortAsc,
              handleSort
            )}
            {renderHeader(
              "Last name",
              "lastName",
              sortKey,
              sortAsc,
              handleSort
            )}
            {renderHeader("Email", "email", sortKey, sortAsc, handleSort)}
            {renderHeader("Phone", "phone", sortKey, sortAsc, handleSort)}
            {renderHeader("Role", "role", sortKey, sortAsc, handleSort)}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.map((lead) => (
            <TableRow key={lead.id}>
              <TableCell>
                <Checkbox
                  checked={selectedIds.includes(lead.id)}
                  onCheckedChange={(checked) =>
                    toggleSelectRow(lead.id, !!checked)
                  }
                />
              </TableCell>
              <TableCell>{lead.firstName}</TableCell>
              <TableCell>{lead.lastName}</TableCell>
              <TableCell>{lead.email}</TableCell>
              <TableCell>{lead.phone}</TableCell>
              <TableCell>{lead.role}</TableCell>
              <TableCell className="flex gap-2 justify-end">
                <Eye
                  className="w-4 h-4 cursor-pointer"
                  onClick={() => router.push(`/dashboard/lead-page/${lead.id}`)}
                />
                <Trash2
                  className="w-4 h-4 cursor-pointer text-red-500"
                  onClick={() => {
                    deleteLeads({ leadIds: [lead.id] });
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between pt-4">
        <div className="text-sm flex items-center gap-2">
          <span className="min-w-28">Rows per page:</span>
          <select
            className="border rounded px-2 py-1"
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
          >
            {[5, 10, 20].map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
        <CustomPagination
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          totalCount={totalCount}
        />
      </div>
    </div>
  );
};
