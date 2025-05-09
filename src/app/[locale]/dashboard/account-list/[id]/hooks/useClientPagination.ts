import { useState } from "react";

export function useClientPagination<T>({
  data,
  search = "",
  sortKey = "",
  sortAsc = true,
}: {
  data: T[];
  search?: string;
  sortKey?: string;
  sortAsc?: boolean;
}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filtered = data.filter((item) =>
    JSON.stringify(item).toLowerCase().includes(search.toLowerCase())
  );

  const sorted = sortKey
    ? [...filtered].sort((a, b) => {
        const valA = a[sortKey as keyof T];
        const valB = b[sortKey as keyof T];

        return sortAsc
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      })
    : filtered;

  const paginated = sorted.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return {
    paginated,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    totalCount: filtered.length,
  };
}
