"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHead,
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

const ITEMS_PER_PAGE = 5;

const AccountScenariosPage = () => {
  const t = useTranslations("AccountScenarios");
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(ITEMS_PER_PAGE);
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const { accountScenariosDataTable = [], deleteAccountScenario } =
    useAccountScenarios({
      enableFetch: true,
    });

  const locale = useLocale();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedScenario, setSelectedScenario] =
    useState<AccountScenario | null>(null);

  const currentItems = accountScenariosDataTable.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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

  const STATUS_OPTIONS = [
    { value: "account_search", label: "Account search" },
    { value: "account_select", label: "Account select" },
    { value: "account_save", label: "Account save" },
    { value: "all", label: "All" },
  ];

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
            <TableHead>{t("table_name")}</TableHead>
            <TableHead>Scenario status</TableHead>
            <TableHead>Created date</TableHead>
            {/* <TableHead className="text-right">{t("table_actions")}</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.map((scenario) => (
            <TableRow key={scenario.id}>
              <TableCell>{scenario.name}</TableCell>
              <TableCell>Scenario status</TableCell>
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
          <Select onValueChange={(val) => setRowsPerPage(Number(val))}>
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
          totalCount={accountScenariosDataTable.length}
          rowsPerPage={ITEMS_PER_PAGE}
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
