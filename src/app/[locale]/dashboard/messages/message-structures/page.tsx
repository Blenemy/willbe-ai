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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMessageStructures } from "@/hooks/useMessageStructures";
import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustomPagination } from "@/components/CustomPagination/CustomPagination";
import { renderHeader } from "@/components/ui/renderHeader";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ITEMS_PER_PAGE = 5;

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
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(ITEMS_PER_PAGE);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sortKey, setSortKey] = useState<"name" | "createdBy" | "createdAt">(
    "name"
  );
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([
    ...LANGUAGE_OPTIONS.map((l) => l.value),
  ]);

  const isAllSelected = selectedLanguages.length === LANGUAGE_OPTIONS.length;

  const toggleLanguage = (lang: string) => {
    setCurrentPage(1);
    if (selectedLanguages.includes(lang)) {
      const updated = selectedLanguages.filter((l) => l !== lang);
      setSelectedLanguages(updated);
    } else {
      setSelectedLanguages([...selectedLanguages, lang]);
    }
  };

  const toggleAllLanguages = () => {
    setCurrentPage(1);
    if (isAllSelected) {
      setSelectedLanguages([]);
    } else {
      setSelectedLanguages(LANGUAGE_OPTIONS.map((l) => l.value));
    }
  };

  const [sortAsc, setSortAsc] = useState(true);
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

  const sortedData = [...filteredData].sort((a, b) => {
    const getValue = (item: (typeof structures)[number]) => {
      switch (sortKey) {
        case "name":
          return item.name || "";
        case "createdBy":
          return `${item.user.firstName} ${item.user.lastName}`;
        case "createdAt":
          return new Date(item.createdAt).getTime();
        default:
          return "";
      }
    };

    const aVal = getValue(a);
    const bVal = getValue(b);

    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortAsc ? aVal - bVal : bVal - aVal;
    }

    return sortAsc
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });

  const currentItems = sortedData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleSort = (key: typeof sortKey) => {
    if (key === sortKey) {
      setSortAsc((prev) => !prev);
    } else {
      setSortKey(key);
      setSortAsc(true);
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

      <div className="flex items-center justify-between pt-4 flex-1">
        <div className="text-sm flex gap-2 flex-grow items-center">
          <p className="min-w-28">{t("rowsPerPage")}</p>
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
          setPage={(p) => setCurrentPage(p + 1)}
          rowsPerPage={rowsPerPage}
          totalCount={filteredData.length}
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

export default MessageStructures;
