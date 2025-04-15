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
  search = "",
  searchField,
  statusFilter = "all",
  statusField,
  sortFieldMap = {},
  initialRowsPerPage = 10,
}: UseClientPaginationProps<T>) => {
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const [page, setPage] = useState(0);
  const [sortKey, setSortKey] = useState<string>("");
  const [sortAsc, setSortAsc] = useState(true);

  const filtered = useMemo(() => {
    let result = [...data];

    if (search && searchField) {
      result = result.filter((item) => {
        const value = item[searchField];
        if (typeof value === "string") {
          return value.toLowerCase().includes(search.toLowerCase());
        }
        return true;
      });
    }

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

    return result;
  }, [
    data,
    search,
    searchField,
    statusFilter,
    statusField,
    sortKey,
    sortFieldMap,
    sortAsc,
  ]);

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
