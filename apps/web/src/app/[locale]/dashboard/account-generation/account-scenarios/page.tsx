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
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useAccountScenarios } from "@/hooks/useAccountScenarios";
import { AccountScenario } from "@/types/AccountScenario";
import { ConfirmDialog } from "@/components/ConfirmDialog/ConfirmDialog";
import { TablePaginationBar } from "@/components/TablePaginationBar/TablePaginationBar";
import { useSortedPage } from "@/hooks/useSortedPage";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { renderHeader } from "@/components/ui/renderHeader";
import { format } from "date-fns";

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
  const [statusFilter, setStatusFilter] = useState("all");
  const router = useRouter();
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

  const {
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    sortKey,
    sortAsc,
    handleSort,
    pageItems: currentItems,
    totalCount,
  } = useSortedPage({
    items: filteredItems,
    initialSortKey: "title",
    getSortValue: (item, key) => {
      switch (key) {
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
    },
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
          {currentItems.map((scenario) => (
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
              <TableCell>
                {" "}
                {format(new Date(scenario.createdAt), "dd/MM/yyyy HH:mm")}
              </TableCell>
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

      <TablePaginationBar
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={setRowsPerPage}
        totalCount={totalCount}
        rowsLabel="Rows per page"
      />

      <ConfirmDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title={t("confirm_title")}
        description={t("confirm_description")}
        cancelLabel={t("cancel")}
        confirmLabel={t("delete")}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default AccountScenariosPage;
