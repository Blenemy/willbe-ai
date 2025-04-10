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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Trash, Copy, Eye, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMessageStructures } from "@/hooks/useMessageStructures";
import { MessageStructure } from "@/types/MessageStructure";
import { useTranslations } from "next-intl";

const ITEMS_PER_PAGE = 5;

const MessageStructures = () => {
  const t = useTranslations("MessageStructures");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedStructureId, setSelectedStructureId] = useState<string | null>(
    null
  );

  const { structures, isLoading, deleteStructure, copyStructure } =
    useMessageStructures();

  const router = useRouter();

  const filteredData = structures.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const currentItems = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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

  const handleCopy = (structure: MessageStructure) => {
    copyStructure(structure);
  };

  const handleOpen = (structureId: string) => {
    router.push(`/dashboard/messages/message-structures/${structureId}`);
  };

  const handleAddNew = () => {
    router.push(`/dashboard/messages/message-structures/create`);
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

      <Input
        placeholder="Search by structure title"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("table_title")}</TableHead>
            <TableHead>{t("table_languages")}</TableHead>
            <TableHead>{t("table_created_by")}</TableHead>
            <TableHead>{t("table_created_date")}</TableHead>
            <TableHead className="text-right">{t("table_actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.map((structure) => (
            <TableRow key={structure.id}>
              <TableCell>{structure.name}</TableCell>
              <TableCell className="flex gap-1">
                {structure.languages.map((lang) => (
                  <Badge key={lang}>{lang}</Badge>
                ))}
              </TableCell>
              <TableCell>
                {structure.user.firstName} {structure.user.lastName}
              </TableCell>
              <TableCell>
                {new Date(structure.createdAt).toLocaleString()}
              </TableCell>
              <TableCell className="flex justify-end gap-2">
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
                  onClick={() => handleCopy(structure)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => handleDeleteClick(structure.id)}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-center mt-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  onClick={() => setCurrentPage(i + 1)}
                  isActive={i + 1 === currentPage}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
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
