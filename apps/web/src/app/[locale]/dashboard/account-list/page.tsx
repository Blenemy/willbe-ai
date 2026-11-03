"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, Trash, Plus } from "lucide-react";
import { TablePaginationBar } from "@/components/TablePaginationBar/TablePaginationBar";
import {
  useDeleteSavedAccount,
  useDeleteSavedAccountsInBulk,
  useSavedAccounts,
} from "@/hooks/useEditScenarioData";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { renderHeader } from "@/components/ui/renderHeader";

type SortKey = "name" | "createdBy" | "createdAt" | "isSyncedWithCrm" | "";

const AccountListPage = () => {
  const t = useTranslations("accountList");
  const { data = [] } = useSavedAccounts();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { mutate: deleteAccount } = useDeleteSavedAccount();
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
    null
  );
  const { mutate: deleteAccountsInBulk } = useDeleteSavedAccountsInBulk();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("");
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc((prev) => !prev);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const openDeleteDialog = (accountId: string) => {
    setSelectedAccountId(accountId);
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedAccountId) {
      deleteAccount(selectedAccountId);
      setIsDialogOpen(false);
    }
  };

  const filteredData = data.filter((item) =>
    item.accountData.name?.toLowerCase().includes(search.toLowerCase())
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortKey) return 0;

    let valA: number | string = "";
    let valB: number | string = "";

    if (sortKey === "name") {
      valA = a.accountData.name;
      valB = b.accountData.name;
    } else if (sortKey === "createdAt") {
      valA = a.createdAt;
      valB = b.createdAt;
    } else if (sortKey === "createdBy") {
      valA = a.createdBy || "";
      valB = b.createdBy || "";
    } else if (sortKey === "isSyncedWithCrm") {
      valA = a.isSyncedWithCrm ? 1 : 0;
      valB = b.isSyncedWithCrm ? 1 : 0;
    }

    return sortAsc
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  const paginated = sortedData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handleAccountClick = (id: string) => {
    router.push(`/dashboard/account-list/${id}`);
  };

  const isAllSelectedOnPage =
    paginated.length > 0 &&
    paginated.every((acc) => selectedIds.includes(acc.id));

  const toggleSelectAllOnPage = () => {
    const pageIds = paginated.map((acc) => acc.id);
    if (isAllSelectedOnPage) {
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const toggleSelectRow = (id: string, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((item) => item !== id)
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;

    deleteAccountsInBulk(selectedIds);
    setSelectedIds([]);
  };

  return (
    <div className="px-6 py-7 space-y-6 w-full">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">{t("title")}</h2>
        <Button
          onClick={() => router.push("/dashboard/account-list/new-account")}
        >
          <Plus className="mr-2 h-4 w-4" />
          {t("create")}
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <Input
          placeholder={t("searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Button
          variant="destructive"
          disabled={selectedIds.length === 0}
          onClick={handleDeleteSelected}
        >
          <Trash className="mr-2 h-4 w-4" />
          {t("deleteSelected", { count: selectedIds.length })}
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]">
              <Checkbox
                checked={isAllSelectedOnPage}
                onCheckedChange={toggleSelectAllOnPage}
              />
            </TableHead>
            {renderHeader(
              t("table.accountTitle"),
              "name",
              sortKey,
              sortAsc,
              handleSort
            )}
            {renderHeader(
              t("table.createdBy"),
              "createdBy",
              sortKey,
              sortAsc,
              handleSort
            )}
            {renderHeader(
              t("table.createdAt"),
              "createdAt",
              sortKey,
              sortAsc,
              handleSort
            )}
            <TableHead className="text-right">{t("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.map((acc) => (
            <TableRow key={acc.id}>
              <TableCell>
                <Checkbox
                  checked={selectedIds.includes(acc.id)}
                  onCheckedChange={(checked) =>
                    toggleSelectRow(acc.id, !!checked)
                  }
                />
              </TableCell>
              <TableCell>
                <div className="flex gap-2 items-center">
                  {acc.accountData.logo && (
                    <Image
                      src={acc.accountData.logo}
                      alt="logo"
                      width={24}
                      height={24}
                    />
                  )}{" "}
                  {acc.accountData.name}
                </div>
              </TableCell>
              <TableCell>{acc.createdBy || "Unknown"}</TableCell>
              <TableCell>
                {format(
                  new Date(acc.createdAt || new Date()),
                  "dd/MM/yyyy, HH:mm"
                )}
              </TableCell>

              <TableCell className="text-right space-x-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleAccountClick(acc.id)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => openDeleteDialog(acc.id)}
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
        onRowsPerPageChange={(rows) => {
          setRowsPerPage(rows);
          setPage(1);
        }}
        totalCount={filteredData.length}
        rowsLabel={t("rowsPerPage")}
        className="flex items-center justify-between pt-4"
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete account</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this account? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccountListPage;
