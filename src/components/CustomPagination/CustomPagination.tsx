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
  const currentPage = page + 1;

  const getPages = (): (number | string)[] => {
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("ellipsis-start");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("ellipsis-end");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <Pagination className="justify-end">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => setPage(Math.max(page - 1, 0))}
            className={
              page === 0 ? "pointer-events-none opacity-50" : "cursor-pointer"
            }
          />
        </PaginationItem>

        {getPages().map((p, i) =>
          typeof p === "string" ? (
            <PaginationItem key={p + i}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={p}>
              <button
                onClick={() => setPage(p - 1)}
                className={`px-3 py-1 rounded-md text-sm min-w-[32px] text-center ${
                  p === currentPage
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
              page >= totalPages - 1
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
