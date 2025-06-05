"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHeader,
} from "@/components/ui/table";
import { Trash, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useAccountScenarios } from "@/hooks/useAccountScenarios";
import { AccountScenario } from "@/types/AccountScenario";
import { CustomPagination } from "@/components/CustomPagination/CustomPagination";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { renderHeader } from "@/components/ui/renderHeader";

const ITEMS_PER_PAGE = 5;

const STATUS_STYLES = {
  save: "bg-green-100 text-green-700",
  select: "bg-yellow-100 text-yellow-700",
  search: "bg-pink-100 text-pink-700",
};

const STATUS_OPTIONS = [
  { value: "search", label: "Account search" },
  { value: "select", label: "Account select" },
  { value: "save", label: "Account save" },
  { value: "all", label: "All" },
];

const AccountScenariosPage = () => {
  const t = useTranslations("AccountScenarios");
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(ITEMS_PER_PAGE);
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const [sortKey, setSortKey] = useState<string>("title");
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const { accountScenariosDataTable = [], deleteAccountScenario } =
    useAccountScenarios({
      enableFetch: true,
    });

  const locale = useLocale();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedScenario, setSelectedScenario] =
    useState<AccountScenario | null>(null);

  const filteredItems = accountScenariosDataTable.filter((scenario) => {
    return (
      (statusFilter === "all" || scenario.status === statusFilter) &&
      scenario.name.toLowerCase().includes(search.toLowerCase())
    );
  });

  const currentItems = filteredItems.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleSort = (key: string) => {
    if (sortKey === key) setSortAsc((prev) => !prev);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const sortedAccounts = [...currentItems].sort((a, b) => {
    const getValue = (item: AccountScenario) => {
      switch (sortKey) {
        case "name":
          return item.name || "";
        case "status":
          return item.status || "";
        case "createBy":
          return item.createdBy || "";
        case "createDate":
          return item.createdAt || "";
        default:
          return "";
      }
    };

    const aVal = getValue(a);
    const bVal = getValue(b);

    return sortAsc
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });

  const handleDeleteClick = (scenario: AccountScenario) => {
    setSelectedScenario(scenario);
    setIsDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedScenario) {
      deleteAccountScenario({ id: selectedScenario.id });
      setIsDialogOpen(false);
      setSelectedScenario(null);
    }
  };

  const handleEditAccount = (scenario: AccountScenario) => {
    const newUrl = new URL(
      `/${locale}/dashboard/account-generation/create-account-scenarios`,
      window.location.origin
    );
    newUrl.searchParams.set("accountId", scenario.id.toString());
    newUrl.searchParams.set("accountName", scenario.name.toString());
    router.replace(newUrl.toString());
  };

  const handleAddAccount = () => {
    const newUrl = new URL(
      `/${locale}/dashboard/account-generation/create-account-scenarios`,
      window.location.origin
    );

    router.replace(newUrl.toString());
  };

  return (
    <div className="w-full px-6 py-10 flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <h2 className="mb-5 font-semibold text-2xl">{t("title")}</h2>
        <div className="flex justify-end mb-4">
          <Button onClick={handleAddAccount}>{t("add_button")}</Button>
        </div>
      </div>

      <div className="flex justify-between gap-4">
        <Input
          placeholder="Search by account name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select onValueChange={setStatusFilter} value={statusFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select value" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            {renderHeader(
              t("table_name"),
              "name",
              sortKey,
              sortAsc,
              handleSort
            )}
            {renderHeader(
              "Scenario status",
              "status",
              sortKey,
              sortAsc,
              handleSort
            )}
            {renderHeader(
              "Create by",
              "createBy",
              sortKey,
              sortAsc,
              handleSort
            )}
            {renderHeader(
              "Created date",
              "createDate",
              sortKey,
              sortAsc,
              handleSort
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedAccounts.map((scenario) => (
            <TableRow key={scenario.id}>
              <TableCell>{scenario.name}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    STATUS_STYLES[scenario.status as keyof typeof STATUS_STYLES]
                  }`}
                >
                  {
                    STATUS_OPTIONS.find((s) => s.value === scenario.status)
                      ?.label
                  }
                </span>
              </TableCell>
              <TableCell>{scenario.createdBy}</TableCell>
              <TableCell>{scenario.createdAt}</TableCell>
              <TableCell className="flex justify-end gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleEditAccount(scenario)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleDeleteClick(scenario)}
                >
                  <Trash className="w-4 h-4 text-red-500" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between pt-4 flex-1">
        <div className="text-sm flex gap-2 flex-grow items-center">
          <p className="min-w-28">Rows per page</p>
          <Select
            onValueChange={(val) => {
              setRowsPerPage(Number(val));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-16">
              <SelectValue placeholder={String(rowsPerPage)} />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20].map((v) => (
                <SelectItem key={v} value={String(v)}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <CustomPagination
          page={currentPage - 1}
          setPage={(pageZeroBased) => setCurrentPage(pageZeroBased + 1)}
          totalCount={filteredItems.length}
          rowsPerPage={rowsPerPage}
        />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("confirm_title")}</DialogTitle>
          </DialogHeader>
          <p>{t("confirm_description")}</p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
              {t("cancel")}
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              {t("delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccountScenariosPage;
