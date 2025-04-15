"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface Props {
  page: number;
  setPage: (page: number) => void;
  rowsPerPage: number;
  totalCount: number;
}

export const CustomPagination = ({
  page,
  setPage,
  rowsPerPage,
  totalCount,
}: Props) => {
  const totalPages = Math.ceil(totalCount / rowsPerPage);

  const getPages = () => {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);

    const pages = [1];

    if (page > 2) pages.push("ellipsis-start");
    if (page > 1 && page < totalPages - 2) pages.push(page + 1);
    if (page < totalPages - 3) pages.push("ellipsis-end");

    pages.push(totalPages);

    return pages;
  };

  return (
    <Pagination className="justify-end">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => setPage(Math.max(page - 1, 0))}
            className={page === 0 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {getPages().map((p, i) =>
          typeof p === "string" ? (
            <PaginationItem key={i}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={i}>
              <button
                onClick={() => setPage(p - 1)}
                className={`px-3 py-1 rounded-md text-sm ${
                  p - 1 === page
                    ? "bg-primary text-white"
                    : "hover:bg-muted text-muted-foreground"
                }`}
              >
                {p}
              </button>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext
            onClick={() => setPage(Math.min(page + 1, totalPages - 1))}
            className={
              page >= totalPages - 1 ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
