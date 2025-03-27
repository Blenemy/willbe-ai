"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { usePaginatedAccountsSearch } from "@/hooks/usePaginatedAccountsSearch";
import { useState } from "react";

const INITIAL_NUMBER_ITEMS_PER_PAGE = 10;

const AccountTable = () => {
  const searchParams = useSearchParams();
  const accountId = searchParams.get("accountId") || "";

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [cursorStack, setCursorStack] = useState<(string | null)[]>([null]);
  const [currentCursorIndex, setCurrentCursorIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(
    INITIAL_NUMBER_ITEMS_PER_PAGE
  );

  const currentCursor = cursorStack[currentCursorIndex];

  const { data, saveSelectedAccounts } = usePaginatedAccountsSearch({
    accountId,
    limit: itemsPerPage,
    cursor: currentCursor,
  });

  const companies = data?.items || [];

  const totalPages = data?.paging
    ? Math.ceil(data.paging.total_count / data.paging.page_count / itemsPerPage)
    : 1;

  const currentPage = data?.paging
    ? Math.floor(data.paging.start / data.paging.page_count) + 1
    : 1;

  const toggleCompanySelection = (id: string) => {
    setSelectedCompanies((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (data?.cursor) {
      const newStack = [...cursorStack];
      newStack.push(data.cursor);
      setCursorStack(newStack);
      setCurrentCursorIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentCursorIndex > 0) {
      setCurrentCursorIndex((prev) => prev - 1);
    }
  };

  const handleLimitChange = (value: string) => {
    const newLimit = parseInt(value);
    setItemsPerPage(newLimit);
    setCursorStack([null]);
    setCurrentCursorIndex(0);
  };

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = () => {
    if (!accountId || !data) return;

    const selectedData = data.items.filter((item) =>
      selectedCompanies.includes(item.id)
    );

    const accounts = selectedData.map((company) => ({
      id: company.id,
      accountScenarioId: accountId,
      accountData: {
        type: company.type,
        id: company.id,
        name: company.name,
        profile_url: company.profile_url,
        summary: company.summary,
        industry: company.industry,
        location: company.location,
        headcount: company.headcount,
        logo: company.logo,
      },
    }));

    saveSelectedAccounts({ accountScenarioId: accountId, accounts });
  };

  return (
    <div className="w-full px-6 py-10 flex flex-col gap-4">
      <h2 className="font-semibold text-2xl">Company List</h2>

      <Select
        value={itemsPerPage.toString()}
        onValueChange={(value) => handleLimitChange(value)}
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Items per page" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="10">10</SelectItem>
          <SelectItem value="25">25</SelectItem>
          <SelectItem value="50">50</SelectItem>
        </SelectContent>
      </Select>

      <Input
        placeholder="Search by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-md"
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Checkbox
                checked={
                  filteredCompanies.length > 0 &&
                  filteredCompanies.every((c) =>
                    selectedCompanies.includes(c.id)
                  )
                }
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedCompanies((prev) => [
                      ...new Set([
                        ...prev,
                        ...filteredCompanies.map((c) => c.id),
                      ]),
                    ]);
                  } else {
                    setSelectedCompanies((prev) =>
                      prev.filter(
                        (id) => !filteredCompanies.some((c) => c.id === id)
                      )
                    );
                  }
                }}
              />
            </TableHead>
            <TableHead>Logo</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Industry</TableHead>
            <TableHead>Headcount</TableHead>
            <TableHead>LinkedIn</TableHead>
            <TableHead>Summary</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCompanies.map((company) => (
            <TableRow key={company.id}>
              <TableCell>
                <Checkbox
                  checked={selectedCompanies.includes(company.id)}
                  onCheckedChange={() => toggleCompanySelection(company.id)}
                />
              </TableCell>
              <TableCell>
                {company.logo && (
                  <Image
                    src={company.logo}
                    alt={company.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                )}
              </TableCell>
              <TableCell>{company.name}</TableCell>
              <TableCell>{company.industry || "-"}</TableCell>
              <TableCell>{company.headcount || "-"}</TableCell>
              <TableCell>
                {company.profile_url && (
                  <a
                    href={company.profile_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    LinkedIn <ExternalLink size={16} />
                  </a>
                )}
              </TableCell>
              <TableCell className="max-w-[400px] whitespace-pre-line">
                {company.summary?.slice(0, 300) + "..."}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center gap-4 mt-6">
        <Button onClick={handlePrev} disabled={currentCursorIndex === 0}>
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button onClick={handleNext} disabled={!data?.cursor}>
          Next
        </Button>
      </div>

      <Button
        className="self-start mt-4"
        onClick={handleSubmit}
        disabled={selectedCompanies.length === 0}
      >
        Submit Selected Companies
      </Button>
    </div>
  );
};

export default AccountTable;
