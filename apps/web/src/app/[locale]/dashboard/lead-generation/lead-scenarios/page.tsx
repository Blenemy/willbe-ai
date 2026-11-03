"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableCaption,
  TableHeader,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trash, Pencil } from "lucide-react";
import { useLeadScenarios } from "@/hooks/useLeadScenarious";
import { ConfirmDialog } from "@/components/ConfirmDialog/ConfirmDialog";
import { LeadScenarios } from "@/types/LeadScenarios";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { CustomPagination } from "@/components/CustomPagination/CustomPagination";
import { format } from "date-fns";
import { renderHeader } from "@/components/ui/renderHeader";
import { Input } from "@/components/ui/input";
import { useSortedPage } from "@/hooks/useSortedPage";

const LeadScenariosPage = () => {
  const t = useTranslations("leadScenarios");

  const [search, setSearch] = useState("");
  const router = useRouter();
  const { leadScenariousTableData = [], deleteLeadScenarious } =
    useLeadScenarios({ enableFetch: true });

  const locale = useLocale();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedScenario, setSelectedScenario] =
    useState<LeadScenarios | null>(null);

  const filteredItems = leadScenariousTableData.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const {
    page,
    setPage,
    rowsPerPage,
    sortKey,
    sortAsc,
    handleSort,
    pageItems: currentItems,
  } = useSortedPage({
    items: filteredItems,
    initialSortKey: "name",
    getSortValue: (item, key) => {
      switch (key) {
        case "name":
          return item.name || "";
        case "status":
          return item.status || "";
        case "createdBy":
          return item.user.firstName + " " + item.user.lastName;
        case "createdAt":
          return item.createdAt || "";
        default:
          return "";
      }
    },
  });

  const handleDeleteClick = (scenario: LeadScenarios) => {
    setSelectedScenario(scenario);
    setIsDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedScenario) {
      deleteLeadScenarious({ id: selectedScenario.id });
      setIsDialogOpen(false);
      setSelectedScenario(null);
    }
  };

  const handleEditScenario = (scenario: LeadScenarios) => {
    const newUrl = new URL(
      `/${locale}/dashboard/lead-generation/create-lead-scenarios`,
      window.location.origin
    );
    newUrl.searchParams.set("scenarioId", scenario.id.toString());
    newUrl.searchParams.set("scenarioName", scenario.name.toString());
    router.replace(newUrl.toString());
  };

  const handleAddScenario = () => {
    const newUrl = new URL(
      `/${locale}/dashboard/lead-generation/create-lead-scenarios`,
      window.location.origin
    );
    router.replace(newUrl.toString());
  };

  return (
    <div className="w-full px-6 py-10 flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <h2 className="mb-5 font-semibold text-2xl">{t("title")}</h2>
        <div className="flex justify-end mb-4">
          <Button onClick={handleAddScenario}>{t("addButton")}</Button>
        </div>
      </div>

      <div className="flex justify-between gap-4">
        <Input
          placeholder={t("searchPlaceholder")}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <Table>
        <TableCaption>{t("tableCaption")}</TableCaption>
        <TableHeader>
          <TableRow>
            {renderHeader(
              t("table.name"),
              "name",
              sortKey,
              sortAsc,
              handleSort
            )}
            {renderHeader(
              t("table.status"),
              "status",
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
              t("table.createdDate"),
              "createdAt",
              sortKey,
              sortAsc,
              handleSort
            )}
            <TableHead className="text-right">{t("table.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.map((scenario) => (
            <TableRow key={scenario.id}>
              <TableCell>{scenario.name}</TableCell>
              <TableCell>
                <Badge variant="secondary">{scenario.status}</Badge>
              </TableCell>
              <TableCell>
                {scenario.user.firstName + " " + scenario.user.lastName}
              </TableCell>
              <TableCell>
                {format(new Date(scenario.createdAt), "dd/MM/yyyy HH:mm")}
              </TableCell>
              <TableCell className="flex justify-end gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleEditScenario(scenario)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => handleDeleteClick(scenario)}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <CustomPagination
        page={page - 1}
        setPage={(pageZeroBased) => setPage(pageZeroBased + 1)}
        totalCount={leadScenariousTableData.length}
        rowsPerPage={rowsPerPage}
      />

      <ConfirmDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title={t("dialog.title")}
        description={t("dialog.description")}
        cancelLabel={t("dialog.cancel")}
        confirmLabel={t("dialog.delete")}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default LeadScenariosPage;
