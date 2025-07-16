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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LeadScenarios } from "@/types/LeadScenarios";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { CustomPagination } from "@/components/CustomPagination/CustomPagination";
import { format } from "date-fns";
import { renderHeader } from "@/components/ui/renderHeader";
import { Input } from "@/components/ui/input";

const ITEMS_PER_PAGE = 5;

const LeadScenariosPage = () => {
  const t = useTranslations("leadScenarios");

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string>("name");
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const router = useRouter();
  const { leadScenariousTableData = [], deleteLeadScenarious } =
    useLeadScenarios({ enableFetch: true });

  const locale = useLocale();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedScenario, setSelectedScenario] =
    useState<LeadScenarios | null>(null);

  const handleSort = (key: string) => {
    if (sortKey === key) setSortAsc((prev) => !prev);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const filteredItems = leadScenariousTableData.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const sortedItems = [...filteredItems].sort((a, b) => {
    const getValue = (item: LeadScenarios) => {
      switch (sortKey) {
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
    };

    const aVal = getValue(a);
    const bVal = getValue(b);

    return sortAsc
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });

  const currentItems = sortedItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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
            setCurrentPage(1);
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
        page={currentPage - 1}
        setPage={(pageZeroBased) => setCurrentPage(pageZeroBased + 1)}
        totalCount={leadScenariousTableData.length}
        rowsPerPage={ITEMS_PER_PAGE}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("dialog.title")}</DialogTitle>
          </DialogHeader>
          <p>{t("dialog.description")}</p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
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

export default LeadScenariosPage;
