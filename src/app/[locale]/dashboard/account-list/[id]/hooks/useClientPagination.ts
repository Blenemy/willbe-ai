import { useMemo, useState } from "react";

interface Props<T> {
  data: T[];
  search?: string;
  searchField?: keyof T;
  initialRowsPerPage?: number;
}

export const useClientPagination = <T>({
  data,
  search = "",
  searchField,
  initialRowsPerPage = 5,
}: Props<T>) => {
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    if (!search || !searchField) return data;
    return data.filter((item) =>
      String(item[searchField]).toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search, searchField]);

  const totalCount = filtered.length;
  const start = page * rowsPerPage;
  const paginated = filtered.slice(start, start + rowsPerPage);

  return {
    paginated,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    totalCount,
  };
};
