"use client";

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
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, Trash, Plus, SlidersHorizontal } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useDeleteMessageScenarios,
  useMessageScenarios,
} from "@/hooks/useMessageScenarios";
import { useRouter } from "next/navigation";
import { CustomPagination } from "@/components/CustomPagination/CustomPagination";
import { useClientPagination } from "@/hooks/useClientPagination";
import { renderHeader } from "@/components/ui/renderHeader";

const ScenarioList = () => {
  const t = useTranslations("scenarioList");

  const columns = [
    { key: "title", label: t("table.title") },
    { key: "leads", label: t("table.leads") },
    { key: "sent", label: t("table.sent") },
    { key: "responseRate", label: t("table.responseRate") },
    { key: "meetingRate", label: t("table.meetingRate") },
    { key: "status", label: t("table.status") },
    { key: "createdBy", label: t("table.createdBy") },
    { key: "createdAt", label: t("table.createdAt") },
  ] as const;

  const STATUS_OPTIONS = [
    { value: "all", label: t("status.all") },
    { value: "not_started", label: t("status.not_started") },
    { value: "in_progress", label: t("status.in_progress") },
    { value: "done", label: t("status.done") },
  ];

  const STATUS_STYLES = {
    done: "bg-green-100 text-green-700",
    in_progress: "bg-yellow-100 text-yellow-700",
    not_started: "bg-pink-100 text-pink-700",
  };

  const [search, setSearch] = useState("");
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [scenarioToDelete, setScenarioToDelete] = useState<string | null>(null);
  const DEFAULT_VISIBLE_COLUMNS = Object.fromEntries(
    columns.map((col) => [col.key, true])
  );

  const { data = [] } = useMessageScenarios({ name: search });
  const deleteMutation = useDeleteMessageScenarios();
  const {
    paginated,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    sortKey,
    setSortKey,
    sortAsc,
    setSortAsc,
    totalCount,
  } = useClientPagination({
    data,
    search,
    searchField: "name",
    statusFilter,
    statusField: "status",
    sortFieldMap: {
      title: "name",
      leads: "leadsInCadence",
      sent: "messagesSent",
      status: "status",
      createdAt: "createdAt",
      createdBy: "user",
    },
  });

  const [visibleColumns, setVisibleColumns] = useState(DEFAULT_VISIBLE_COLUMNS);

  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const openDeleteDialog = (id: string) => {
    setScenarioToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (scenarioToDelete) {
      deleteMutation.mutate([scenarioToDelete]);
      setIsDeleteDialogOpen(false);
      setScenarioToDelete(null);
    }
  };

  const handleSort = (key: string) => {
    if (sortKey === key) setSortAsc((prev) => !prev);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  useEffect(() => {
    setSortKey("createdAt");
    setSortAsc(false);
  }, [setSortAsc, setSortKey]);

  const isAllSelected =
    paginated.length > 0 && selectedIds.length === paginated.length;

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginated.map((scenario) => scenario.id));
    }
  };

  return (
    <div className="px-6 py-10 space-y-6 w-full">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">{t("title")}</h2>
        <div className="flex gap-2">
          <Button
            onClick={() => router.push("/dashboard/create-message-scenario")}
          >
            <Plus className="mr-2 h-4 w-4" />
            {t("create")}
          </Button>
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

      <div className="flex justify-between gap-4">
        <Input
          placeholder={t("searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select onValueChange={setStatusFilter} value={statusFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder={t("sortByStatus")} />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="destructive"
          disabled={selectedIds.length === 0}
          onClick={() => {
            deleteMutation.mutate(selectedIds);
            setSelectedIds([]);
          }}
        >
          {t("deleteSelected", { count: selectedIds.length })}
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={handleToggleSelectAll}
              />
            </TableHead>
            {columns
              .filter((col) => visibleColumns[col.key])
              .map((col) =>
                React.cloneElement(
                  renderHeader(
                    col.label,
                    col.key,
                    sortKey,
                    sortAsc,
                    handleSort
                  ),
                  { key: col.key }
                )
              )}
            <TableHead className="text-right w-[80px]">
              {t("actions")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.map((scenario) => (
            <TableRow key={scenario.id}>
              <TableCell className="w-[40px]">
                <Checkbox
                  checked={selectedIds.includes(scenario.id)}
                  onCheckedChange={(checked) =>
                    setSelectedIds((prev) =>
                      checked
                        ? [...prev, scenario.id]
                        : prev.filter((id) => id !== scenario.id)
                    )
                  }
                />
              </TableCell>
              {visibleColumns.title && (
                <TableCell className="max-w-[200px] break-words">
                  {scenario.name}
                </TableCell>
              )}
              {visibleColumns.leads && (
                <TableCell>{scenario.leadsInCadence}</TableCell>
              )}
              {visibleColumns.sent && (
                <TableCell>{scenario.messagesSent || 0}</TableCell>
              )}
              {visibleColumns.responseRate && <TableCell>10%</TableCell>}
              {visibleColumns.meetingRate && <TableCell>10%</TableCell>}
              {visibleColumns.status && (
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      STATUS_STYLES[
                        scenario.status as keyof typeof STATUS_STYLES
                      ]
                    }`}
                  >
                    {
                      STATUS_OPTIONS.find((s) => s.value === scenario.status)
                        ?.label
                    }
                  </span>
                </TableCell>
              )}
              {visibleColumns.createdBy && (
                <TableCell>
                  {scenario.user.firstName + " " + scenario.user.lastName}
                </TableCell>
              )}
              {visibleColumns.createdAt && (
                <TableCell>
                  {format(new Date(scenario.createdAt), "dd/MM/yyyy HH:mm")}
                </TableCell>
              )}
              <TableCell className="text-right w-[80px] space-x-2">
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() =>
                      router.push(
                        `/dashboard/create-message-scenario/${scenario.id}`
                      )
                    }
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => openDeleteDialog(scenario.id)}
                  >
                    <Trash className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between pt-4 flex-1">
        <div className="text-sm flex gap-2 flex-grow items-center">
          <p className="min-w-28">{t("rowsPerPage")}</p>
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
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          totalCount={totalCount}
        />
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("dialog.confirmDeleteTitle")}</DialogTitle>
          </DialogHeader>
          <p>{t("dialog.confirmDeleteText")}</p>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              {t("dialog.cancel")}
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              {t("dialog.delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ScenarioList;
