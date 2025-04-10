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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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

const ITEMS_PER_PAGE = 5;

const LeadScenariosPage = () => {
  const t = useTranslations("leadScenarios");

  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const { leadScenariousTableData = [], deleteLeadScenarious } =
    useLeadScenarios({ enableFetch: true });

  const locale = useLocale();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedScenario, setSelectedScenario] =
    useState<LeadScenarios | null>(null);

  const totalPages = Math.ceil(leadScenariousTableData.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = leadScenariousTableData.slice(
    indexOfFirstItem,
    indexOfLastItem
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
    <div className="w-full px-6 py-10 flex flex-col">
      <h2 className="mb-5 font-semibold text-2xl">{t("title")}</h2>
      <div className="flex justify-end mb-4">
        <Button onClick={handleAddScenario}>{t("addButton")}</Button>
      </div>
      <Table>
        <TableCaption>{t("tableCaption")}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>{t("table.name")}</TableHead>
            <TableHead>{t("table.status")}</TableHead>
            <TableHead>{t("table.createdBy")}</TableHead>
            <TableHead>{t("table.createdDate")}</TableHead>
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
              <TableCell>{scenario.createdAt}</TableCell>
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
      <div className="mt-4 flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  href="#"
                  onClick={() => setCurrentPage(index + 1)}
                  isActive={index + 1 === currentPage}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

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
