"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableHeader,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trash, Copy, Eye, Plus, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ConfirmDialog } from "@/components/ConfirmDialog/ConfirmDialog";
import { TablePaginationBar } from "@/components/TablePaginationBar/TablePaginationBar";
import { useMessageStructures } from "@/hooks/useMessageStructures";
import { useTranslations } from "next-intl";
import { renderHeader } from "@/components/ui/renderHeader";
import { useSortedPage } from "@/hooks/useSortedPage";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LANGUAGE_OPTIONS = [
  { value: "English", label: "English" },
  { value: "Spanish", label: "Spanish" },
  { value: "French", label: "French" },
  { value: "Portuguese", label: "Portuguese" },
  { value: "German", label: "German" },
  { value: "Italian", label: "Italian" },
];

const MessageStructures = () => {
  const t = useTranslations("MessageStructures");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([
    ...LANGUAGE_OPTIONS.map((l) => l.value),
  ]);

  const isAllSelected = selectedLanguages.length === LANGUAGE_OPTIONS.length;
  const [selectedStructureId, setSelectedStructureId] = useState<string | null>(
    null
  );

  const { structures, isLoading, deleteStructure, copyStructure } =
    useMessageStructures({ enableFetch: true });

  const router = useRouter();

  const filteredData = structures.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesLanguage =
      selectedLanguages.length > 0 &&
      item.languages.some((lang) => selectedLanguages.includes(lang));
    return matchesSearch && matchesLanguage;
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
    items: filteredData,
    initialSortKey: "name",
    getSortValue: (item, key) => {
      switch (key) {
        case "name":
          return item.name || "";
        case "createdBy":
          return `${item.user.firstName} ${item.user.lastName}`;
        case "createdAt":
          return new Date(item.createdAt).getTime();
        default:
          return "";
      }
    },
  });

  const toggleLanguage = (lang: string) => {
    setPage(1);
    if (selectedLanguages.includes(lang)) {
      const updated = selectedLanguages.filter((l) => l !== lang);
      setSelectedLanguages(updated);
    } else {
      setSelectedLanguages([...selectedLanguages, lang]);
    }
  };

  const toggleAllLanguages = () => {
    setPage(1);
    if (isAllSelected) {
      setSelectedLanguages([]);
    } else {
      setSelectedLanguages(LANGUAGE_OPTIONS.map((l) => l.value));
    }
  };

  const handleDeleteClick = (id: string) => {
    setSelectedStructureId(id);
    setIsDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedStructureId) {
      deleteStructure(selectedStructureId);
      setIsDialogOpen(false);
      setSelectedStructureId(null);
    }
  };

  const handleCopy = (messageStructureId: string) => {
    copyStructure(messageStructureId);
  };

  const handleOpen = (structureId: string) => {
    router.push(`/dashboard/create-message-structures/${structureId}`);
  };

  const handleAddNew = () => {
    router.push(`/dashboard/create-message-structures`);
  };

  if (isLoading) {
    return <div className="p-6">Loading message structures...</div>;
  }

  return (
    <div className="w-full px-6 py-10 flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-2xl">{t("title")}</h2>
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          {t("create_button")}
        </Button>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="Search by structure title"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              {isAllSelected
                ? "All languages"
                : selectedLanguages.length > 0
                ? `${selectedLanguages.length} selected`
                : "No language selected"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuCheckboxItem
              checked={isAllSelected}
              onSelect={(e) => {
                e.preventDefault();
                toggleAllLanguages();
              }}
            >
              All
            </DropdownMenuCheckboxItem>
            {LANGUAGE_OPTIONS.map((opt) => (
              <DropdownMenuCheckboxItem
                key={opt.value}
                checked={selectedLanguages.includes(opt.value)}
                onSelect={(e) => {
                  e.preventDefault();
                  toggleLanguage(opt.value);
                }}
              >
                {opt.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            {renderHeader(
              t("table_title"),
              "name",
              sortKey,
              sortAsc,
              handleSort
            )}
            <TableHead className="w-[500px]">{t("table_languages")}</TableHead>
            {renderHeader(
              t("table_created_by"),
              "createdBy",
              sortKey,
              sortAsc,
              handleSort
            )}
            {renderHeader(
              t("table_created_date"),
              "createdAt",
              sortKey,
              sortAsc,
              handleSort
            )}
            <TableHead className="text-right">{t("table_actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.map((structure) => (
            <TableRow key={structure.id}>
              <TableCell
                className="w-[220px] truncate whitespace-nowrap overflow-hidden"
                title={structure.name}
              >
                {structure.name}
              </TableCell>
              <TableCell className="w-[500px]">
                <div className="flex flex-wrap gap-1">
                  {structure.languages.map((lang) => (
                    <Badge key={lang}>{lang}</Badge>
                  ))}
                </div>
              </TableCell>

              <TableCell className="w-[180px]">
                {structure.user.firstName} {structure.user.lastName}
              </TableCell>
              <TableCell className="w-[180px]">
                {new Date(structure.createdAt).toLocaleString()}
              </TableCell>
              <TableCell className=" flex justify-end gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleOpen(structure.id)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleCopy(structure.id)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleDeleteClick(structure.id)}
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
        rowsLabel={t("rowsPerPage")}
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

export default MessageStructures;
