"use client";

import { CustomPagination } from "@/components/CustomPagination/CustomPagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PAGE_SIZE_OPTIONS = [5, 10, 20];

export function TablePaginationBar({
  page,
  setPage,
  rowsPerPage,
  onRowsPerPageChange,
  totalCount,
  rowsLabel,
  className = "flex items-center justify-between pt-4 flex-1",
}: {
  page: number;
  setPage: (page: number) => void;
  rowsPerPage: number;
  onRowsPerPageChange: (rows: number) => void;
  totalCount: number;
  rowsLabel: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="text-sm flex gap-2 flex-grow items-center">
        <p className="min-w-28">{rowsLabel}</p>
        <Select
          onValueChange={(val) => {
            onRowsPerPageChange(Number(val));
          }}
        >
          <SelectTrigger className="w-16">
            <SelectValue placeholder={String(rowsPerPage)} />
          </SelectTrigger>
          <SelectContent>
            {PAGE_SIZE_OPTIONS.map((v) => (
              <SelectItem key={v} value={String(v)}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <CustomPagination
        page={page - 1}
        setPage={(pageZeroBased) => setPage(pageZeroBased + 1)}
        totalCount={totalCount}
        rowsPerPage={rowsPerPage}
      />
    </div>
  );
}
