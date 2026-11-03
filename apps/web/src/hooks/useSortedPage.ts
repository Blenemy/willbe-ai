"use client";

import { useState } from "react";

function compareSortValues(
  a: string | number,
  b: string | number,
  asc: boolean
) {
  if (typeof a === "number" && typeof b === "number") {
    return asc ? a - b : b - a;
  }

  const result = String(a).localeCompare(String(b));
  return asc ? result : -result;
}

export function useSortedPage<T>({
  items,
  initialSortKey,
  initialSortAsc = true,
  initialRowsPerPage = 5,
  getSortValue,
}: {
  items: T[];
  initialSortKey: string;
  initialSortAsc?: boolean;
  initialRowsPerPage?: number;
  getSortValue: (item: T, key: string) => string | number;
}) {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPageState] = useState(initialRowsPerPage);
  const [sortKey, setSortKey] = useState(initialSortKey);
  const [sortAsc, setSortAsc] = useState(initialSortAsc);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortAsc((prev) => !prev);
      return;
    }

    setSortKey(key);
    setSortAsc(true);
  };

  const setRowsPerPage = (value: number) => {
    setRowsPerPageState(value);
    setPage(1);
  };

  const sortedItems = [...items].sort((a, b) => {
    if (!sortKey) return 0;
    return compareSortValues(
      getSortValue(a, sortKey),
      getSortValue(b, sortKey),
      sortAsc
    );
  });

  const pageItems = sortedItems.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return {
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    sortKey,
    sortAsc,
    handleSort,
    pageItems,
    totalCount: items.length,
  };
}
