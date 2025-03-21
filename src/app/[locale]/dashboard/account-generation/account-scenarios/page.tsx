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
import { Trash, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useAccountScenarios } from "@/hooks/useAccountScenarios";
import { AccountScenario } from "@/types/AccountScenario";

const ITEMS_PER_PAGE = 5;

const AccountScenariosPage = () => {
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

  const totalPages = Math.ceil(
    accountScenariosDataTable.length / ITEMS_PER_PAGE
  );
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = accountScenariosDataTable.slice(
    indexOfFirstItem,
    indexOfLastItem
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

  return (
    <div className="w-full px-6 py-10 flex flex-col">
      <h2 className="mb-5 font-semibold text-2xl">Lead Scenarios</h2>
      <div className="flex justify-end mb-4">
        <Button onClick={handleAddAccount}>Add New Scenario</Button>
      </div>
      <Table>
        <TableCaption>A list of lead scenarios</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Account Name</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.map((scenario) => (
            <TableRow key={scenario.id}>
              <TableCell>{scenario.name}</TableCell>
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
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this scenario?</p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccountScenariosPage;
