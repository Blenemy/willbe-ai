"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter, useSearchParams } from "next/navigation";
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
import { SkeletonTable } from "../../skeletons/SkeletonTable";
import { useDebouncedValue } from "@/hooks/useDebounce";
import { getAccountStatusDot } from "@/utils/getAccountsStatusDot";

const ROWS_PER_PAGE_LIMIT = 30;

interface Props {
  cursors: {
    lastPageCursor: string | null | undefined;
    previousPageCursor: string | null | undefined;
  };
}

const AccountTable = ({ cursors }: Props) => {
  const searchParams = useSearchParams();
  const accountId = searchParams.get("accountId") || "";
  const router = useRouter();
  const t = useTranslations("accountTable");
  const [sortKey, setSortKey] = useState<string>("title");
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const columns = [
    { key: "logo", label: t("table.logo"), defaultVisible: true },
    { key: "name", label: t("table.name"), defaultVisible: true },
    { key: "industry", label: t("table.industry"), defaultVisible: true },
    { key: "headcount", label: t("table.headcount"), defaultVisible: true },
    { key: "linkedin", label: t("table.linkedin"), defaultVisible: true },
    { key: "summary", label: t("table.summary"), defaultVisible: true },
    { key: "messageSent", label: t("table.messageSent"), defaultVisible: true },
    {
      key: "messageReceived",
      label: t("table.messageReceived"),
      defaultVisible: true,
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 500);
  const {
    selectedCompanies,
    toggleCompany,
    addCompanies,
    removeCompanies,
    clear: clearSelected,
  } = useSelectedCompaniesStore();

  const [cursor, setCursor] = useState<string | null>(
    cursors.lastPageCursor ?? null
  );

  const DEFAULT_VISIBLE_COLUMNS = Object.fromEntries(
    columns.map((col) => [col.key, col.defaultVisible])
  );

  const [visibleColumns, setVisibleColumns] = useState(DEFAULT_VISIBLE_COLUMNS);

  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const { data, saveSelectedAccounts, isFetching } = usePaginatedAccountsSearch(
    {
      accountId,
      limit: ROWS_PER_PAGE_LIMIT,
      cursor,
      queryString: debouncedSearchTerm,
    }
  );

  const handleSort = (key: string) => {
    if (sortKey === key) setSortAsc((prev) => !prev);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  useEffect(() => {
    if (!isFetching && data) {
      setIsInitialLoading(false);
    }
  }, [isFetching, data]);

  useEffect(() => {
    if (searchTerm !== "") {
      setCursor(null);
    }
  }, [debouncedSearchTerm, searchTerm]);

  const companies = data?.items || [];

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

  const handleNavigateToAccount = (accountId: string, status: string) => {
    if (status === "not_contacted") return;
    router.push(`/dashboard/account-list/${accountId}`);
  };

  const openScenarioStats = (scenarioId: string | null | undefined) => {
    if (scenarioId) {
      router.push(`/dashboard/create-message-scenario/${scenarioId}`);
    }
  };

  const sortedCompanies = [...companies].sort((a, b) => {
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

  if (isInitialLoading) {
    return <SkeletonTable showHeader />;
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

      <div className="flex gap-4 max-w-md items-center">
        <Input
          placeholder={t("searchPlaceholder")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="w-5 h-5 flex items-center justify-center">
          {isFetching && <Spinner className="w-4 h-4" />}
        </div>
      </div>

      {isFetching && <SkeletonTable showHeader={false} />}

      {!isFetching && companies.length === 0 && <div>{t("no_results")}</div>}

      {!isFetching && companies.length > 0 && (
        <>
          <Table className="table-fixed border-separate border-spacing-y-1 compact-table">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[36px] p-1">
                  <Checkbox
                    checked={
                      sortedCompanies.length > 0 &&
                      sortedCompanies
                        .filter((c) => !c.isSaved)
                        .every((c) => c.id in selectedCompanies)
                    }
                    onCheckedChange={(checked) => {
                      const selectableCompanies = sortedCompanies.filter(
                        (c) => !c.isSaved
                      );
                      if (checked) addCompanies(selectableCompanies);
                      else removeCompanies(selectableCompanies);
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

                {visibleColumns.summary && (
                  <TableHead className="w-[90px] truncate hidden md:table-cell">
                    {t("table.summary")}
                  </TableHead>
                )}
                {visibleColumns.linkedin && (
                  <TableHead className="w-[60px] truncate">
                    {t("table.linkedin")}
                  </TableHead>
                )}
                {visibleColumns.messageSent && (
                  <TableHead className="w-[60px] max-w-[60px] text-xs break-words !whitespace-normal leading-tight px-1">
                    {t("table.messageSent")}
                  </TableHead>
                )}

                {visibleColumns.messageReceived && (
                  <TableHead className="w-[60px] max-w-[60px] text-xs break-words !whitespace-normal leading-tight px-1">
                    {t("table.messageReceived")}
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedCompanies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell className="p-1 w-[36px]">
                    <div className="flex items-center h-full">
                      <Checkbox
                        checked={!!selectedCompanies[company.id]}
                        onCheckedChange={() => toggleCompany(company)}
                        disabled={company.isSaved}
                      />
                    </div>
                  </TableCell>
                  {visibleColumns.logo && (
                    <TableCell className="p-1 w-[44px]">
                      <div
                        className="relative cursor-pointer w-10 h-10 flex items-center justify-center"
                        onClick={() =>
                          handleNavigateToAccount(
                            company.id,
                            company.lastSentMessageStatus
                          )
                        }
                      >
                        {company.logo && (
                          <Image
                            src={company.logo}
                            alt={company.name}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        )}

                        <TooltipProvider delayDuration={200}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="absolute -left-[10px] -translate-x-1 top-1/2 -translate-y-1/2 w-2 h-2">
                                <div
                                  className={`status-dot ${
                                    getAccountStatusDot(company.messageStatus)
                                      .color
                                  }`}
                                />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              {
                                getAccountStatusDot(company.messageStatus)
                                  .tooltip
                              }
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
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

                  {visibleColumns.summary && (
                    <TableCell className="w-[90px] max-w-[90px] hidden md:table-cell p-1">
                      <TooltipProvider delayDuration={200}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="cursor-help block w-full overflow-hidden text-ellipsis whitespace-nowrap">
                              {company.summary}
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

                  {visibleColumns.linkedin && (
                    <TableCell className="w-[60px] truncate">
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

                  {visibleColumns.messageSent && (
                    <TableCell className="w-[60px] max-w-[60px] px-1 py-2">
                      {company.lastSentMessageDate ? (
                        <span
                          onClick={() =>
                            openScenarioStats(company.lastSentScenarioId)
                          }
                          title={company.lastSentMessageDate}
                          className="text-blue-600 hover:underline cursor-pointer inline-block max-w-full truncate"
                        >
                          {company.lastSentMessageDate}
                        </span>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                  )}

                  {visibleColumns.messageReceived && (
                    <TableCell className="w-[60px] max-w-[60px] px-1 py-2">
                      {company.lastReceivedMessageDate ? (
                        <span
                          onClick={() =>
                            openScenarioStats(company.lastReceivedScenarioId)
                          }
                          title={company.lastReceivedMessageDate}
                          className="text-blue-600 hover:underline cursor-pointer inline-block max-w-full truncate"
                        >
                          {company.lastReceivedMessageDate}
                        </span>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between pt-4">
            <CustomPagination
              page={data?.pageIndex ?? 0}
              setPage={(newPageIndex) => {
                if (!data) return;

                if (newPageIndex > (data.pageIndex ?? 0)) {
                  setCursor(data.cursor ?? null);
                } else if (newPageIndex < (data.pageIndex ?? 0)) {
                  setCursor(data.previousPageCursor ?? null);
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
        </>
      )}
    </div>
  );
};

export default AccountTable;
