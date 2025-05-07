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

interface Lead {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
}

export const LeadsTab = ({ leads }: { leads: Lead[] }) => {
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const { paginated, page, setPage, rowsPerPage, setRowsPerPage, totalCount } =
    useClientPagination({
      data: leads,
      search,
      searchField: "firstName",
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

  const toggleSelectRow = (id: number, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((item) => item !== id)
    );
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
            onClick={() => alert(`Delete leads: ${selectedIds.join(", ")}`)}
          >
            Delete selected
          </Button>
          <Button onClick={() => alert("Redirect to Add Lead page")}>
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
            <TableHead>First name</TableHead>
            <TableHead>Last name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Role</TableHead>
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
                <Eye className="w-4 h-4 cursor-pointer" />
                <Trash2 className="w-4 h-4 cursor-pointer text-red-500" />
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
