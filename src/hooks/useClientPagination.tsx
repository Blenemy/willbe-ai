/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from "react";

interface UseClientPaginationProps<T> {
  data: T[];
  search?: string;
  searchField?: keyof T;
  statusFilter?: string;
  statusField?: keyof T;
  sortFieldMap?: Record<string, keyof T>;
  initialRowsPerPage?: number;
}

export const useClientPagination = <T,>({
  data,
  statusFilter = "all",
  statusField,
  sortFieldMap = {},
  initialRowsPerPage = 5,
}: UseClientPaginationProps<T>) => {
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const [page, setPage] = useState(0);
  const [sortKey, setSortKey] = useState<string>("");
  const [sortAsc, setSortAsc] = useState(true);

  const filtered = useMemo(() => {
    let result = [...data];

    if (statusFilter !== "all" && statusField) {
      result = result.filter((item) => item[statusField] === statusFilter);
    }

    if (sortKey && sortFieldMap[sortKey]) {
      const field = sortFieldMap[sortKey];
      result.sort((a, b) => {
        const valA = a[field];
        const valB = b[field];

        if (typeof valA === "object" && typeof valB === "object") {
          return sortAsc
            ? String(valA).localeCompare(String(valB))
            : String(valB).localeCompare(String(valA));
        }

        return sortAsc ? (valA > valB ? 1 : -1) : valA < valB ? 1 : -1;
      });
    }

    if (sortKey) {
      result.sort((a, b) => {
        let valA, valB;

        if (sortKey === "createdBy") {
          valA = `${(a as any).user?.firstName ?? ""} ${
            (a as any).user?.lastName ?? ""
          }`.toLowerCase();
          valB = `${(b as any).user?.firstName ?? ""} ${
            (b as any).user?.lastName ?? ""
          }`.toLowerCase();
        } else if (sortFieldMap[sortKey]) {
          const field = sortFieldMap[sortKey];
          valA = a[field];
          valB = b[field];

          if (typeof valA === "object" && typeof valB === "object") {
            valA = String(valA);
            valB = String(valB);
          }
        }

        if (valA == null || valB == null) return 0;

        return sortAsc
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      });
    }

    return result;
  }, [data, statusFilter, statusField, sortKey, sortFieldMap, sortAsc]);

  const paginated = useMemo(() => {
    return filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  return {
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    sortKey,
    setSortKey,
    sortAsc,
    setSortAsc,
    filtered,
    paginated,
    totalCount: filtered.length,
  };
};
