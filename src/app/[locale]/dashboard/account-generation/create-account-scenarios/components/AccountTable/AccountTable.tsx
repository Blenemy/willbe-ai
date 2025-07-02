"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { usePaginatedAccountsSearch } from "@/hooks/usePaginatedAccountsSearch";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Spinner } from "@/components/Spinner/Spinner";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import linkedinImage from "@/assets/LinkedinLogo.svg";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CustomPagination } from "@/components/CustomPagination/CustomPagination";
import { renderCompactHeader } from "@/components/ui/renderHeader";
import { useSelectedCompaniesStore } from "@/store/useSelectedCompaniesStore";
import { parseHeadcount } from "@/utils/parsedHeadcount";

const ROWS_PER_PAGE_LIMIT = 30;

const AccountTable = () => {
  const searchParams = useSearchParams();
  const accountId = searchParams.get("accountId") || "";
  const t = useTranslations("accountTable");
  const [sortKey, setSortKey] = useState<string>("title");
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const columns: { key: string; label: string; defaultVisible: boolean }[] = [
    { key: "logo", label: t("table.logo"), defaultVisible: true },
    { key: "name", label: t("table.name"), defaultVisible: true },
    { key: "industry", label: t("table.industry"), defaultVisible: true },
    { key: "headcount", label: t("table.headcount"), defaultVisible: true },
    { key: "linkedin", label: t("table.linkedin"), defaultVisible: true },
    { key: "summary", label: t("table.summary"), defaultVisible: true },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const {
    selectedCompanies,
    toggleCompany,
    addCompanies,
    removeCompanies,
    clear: clearSelected,
  } = useSelectedCompaniesStore();

  const [cursorStack, setCursorStack] = useState<(string | null)[]>([null]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [currentCursorIndex, setCurrentCursorIndex] = useState(0);

  const DEFAULT_VISIBLE_COLUMNS = Object.fromEntries(
    columns.map((col) => [col.key, col.defaultVisible !== false])
  );

  const [visibleColumns, setVisibleColumns] = useState(DEFAULT_VISIBLE_COLUMNS);

  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  useEffect(() => {
    setCursor(cursorStack.at(currentCursorIndex) ?? null);
  }, [cursorStack, currentCursorIndex]);

  const { data, saveSelectedAccounts, isFetching } = usePaginatedAccountsSearch(
    {
      accountId,
      limit: ROWS_PER_PAGE_LIMIT,
      cursor,
    }
  );

  const handleSort = (key: string) => {
    if (sortKey === key) setSortAsc((prev) => !prev);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const companies = data?.items || [];

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async () => {
    if (!accountId) return;

    const accounts = Object.values(selectedCompanies).map((company) => ({
      type: company.type,
      id: company.id,
      name: company.name,
      profile_url: company.profile_url,
      summary: company.summary,
      industry: company.industry,
      location: company.location,
      headcount: company.headcount.toString(),
      logo: company.logo,
    }));

    await saveSelectedAccounts({ accountScenarioId: accountId, accounts });
    clearSelected();
  };

  const sortedCompanies = [...filteredCompanies].sort((a, b) => {
    // @ts-expect-error element implicitly has an "any" type
    const aVal = a?.[sortKey] ?? "";
    // @ts-expect-error element implicitly has an "any" type
    const bVal = b?.[sortKey] ?? "";

    if (sortKey === "headcount") {
      const numA = parseHeadcount(String(aVal));
      const numB = parseHeadcount(String(bVal));
      return sortAsc ? numA - numB : numB - numA;
    }

    return sortAsc
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });

  if (isFetching) {
    return <Spinner />;
  }

  if (!data || data?.items.length === 0) {
    return <div>Companies were not found</div>;
  }

  return (
    <div className="w-full px-6 py-10 flex flex-col gap-4">
      <div className="flex justify-between">
        <h2 className="font-semibold text-2xl">{t("title")}</h2>
        <div className="flex gap-5 items-center">
          <p className="text-[#5F5F5F] text-sm">
            {t("total_number_of_items")} {data?.paging.total_count}
          </p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                {t("view")}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {columns.map((col) => (
                <DropdownMenuCheckboxItem
                  key={col.key}
                  checked={visibleColumns[col.key]}
                  onSelect={(e) => {
                    e.preventDefault();
                    toggleColumn(col.key);
                  }}
                >
                  {col.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {isFetching ? (
        <Spinner className="mr-2" />
      ) : (
        <div className="flex flex-col gap-4">
          <Input
            placeholder={t("searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />

          <Table className="table-fixed border-separate border-spacing-y-1 compact-table">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[36px] p-1">
                  <Checkbox
                    checked={
                      filteredCompanies.length > 0 &&
                      filteredCompanies.every((c) => c.id in selectedCompanies)
                    }
                    onCheckedChange={(checked) => {
                      if (checked) {
                        addCompanies(filteredCompanies);
                      } else {
                        removeCompanies(filteredCompanies);
                      }
                    }}
                  />
                </TableHead>
                {visibleColumns.logo && (
                  <TableHead className="w-[44px] p-1">
                    {t("table.logo")}
                  </TableHead>
                )}
                {visibleColumns.name &&
                  renderCompactHeader(
                    t("table.name"),
                    "name",
                    sortKey,
                    sortAsc,
                    handleSort
                  )}
                {visibleColumns.industry &&
                  renderCompactHeader(
                    t("table.industry"),
                    "industry",
                    sortKey,
                    sortAsc,
                    handleSort
                  )}
                {visibleColumns.headcount &&
                  renderCompactHeader(
                    t("table.headcount"),
                    "headcount",
                    sortKey,
                    sortAsc,
                    handleSort
                  )}
                {visibleColumns.linkedin && (
                  <TableHead className="w-[90px] truncate">
                    {t("table.linkedin")}
                  </TableHead>
                )}
                {visibleColumns.summary && (
                  <TableHead className="w-[320px] truncate hidden md:table-cell">
                    {t("table.summary")}
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedCompanies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell className="p-1 w-[36px]">
                    <Checkbox
                      checked={!!selectedCompanies[company.id]}
                      onCheckedChange={() => toggleCompany(company)}
                      disabled={company.isSaved}
                    />
                  </TableCell>

                  {visibleColumns.logo && (
                    <TableCell className="p-1 w-[44px]">
                      {company.logo && (
                        <Image
                          src={company.logo}
                          alt={company.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      )}
                    </TableCell>
                  )}
                  {visibleColumns.name && (
                    <TableCell className="w-[120px] truncate">
                      {company.name}
                    </TableCell>
                  )}
                  {visibleColumns.industry && (
                    <TableCell className="w-[120px] truncate">
                      {company.industry}
                    </TableCell>
                  )}
                  {visibleColumns.headcount && (
                    <TableCell className="w-[60px] truncate">
                      {company.headcount}
                    </TableCell>
                  )}
                  {visibleColumns.linkedin && (
                    <TableCell className="w-[90px] truncate">
                      {company.profile_url && (
                        <a
                          href={company.profile_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-[2px]"
                        >
                          <Image
                            src={linkedinImage}
                            alt="LinkedIn"
                            width={16}
                            height={16}
                          />
                        </a>
                      )}
                    </TableCell>
                  )}
                  {visibleColumns.summary && (
                    <TableCell className="w-[320px] truncate hidden md:table-cell">
                      <TooltipProvider delayDuration={200}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="cursor-help inline-block max-w-full truncate">
                              {company.summary?.slice(0, 120) + "..."}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent
                            side="top"
                            className="max-w-sm whitespace-pre-line break-words"
                          >
                            {company.summary}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between pt-4 flex-1">
            <CustomPagination
              page={currentCursorIndex}
              setPage={(newIndex) => {
                if (newIndex === currentCursorIndex) return;
                if (cursorStack[newIndex] !== undefined) {
                  setCurrentCursorIndex(newIndex);
                } else if (newIndex === cursorStack.length && data) {
                  setCursorStack((prev) => [...prev, data.cursor ?? null]);
                  setCurrentCursorIndex(newIndex);
                } else {
                  console.warn(
                    `Cannot jump from ${currentCursorIndex} to ${newIndex} — cursor not available`
                  );
                }
              }}
              rowsPerPage={ROWS_PER_PAGE_LIMIT}
              totalCount={data?.paging.total_count ?? 0}
              disablePageJumping
            />
          </div>

          <Button
            className="mt-4 self-center"
            onClick={handleSubmit}
            disabled={Object.keys(selectedCompanies).length === 0}
          >
            {t("submit")}
          </Button>
        </div>
      )}
    </div>
  );
};

export default AccountTable;
