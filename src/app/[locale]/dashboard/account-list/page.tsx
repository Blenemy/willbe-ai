"use client";

import React, { useEffect, useState, useMemo } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, Trash, Plus } from "lucide-react";
import { CustomPagination } from "@/components/CustomPagination/CustomPagination";
import { useSavedAccounts } from "@/hooks/useEditScenarioData";

const AccountListPage = () => {
  const t = useTranslations("accountList");
  const { data = [] } = useSavedAccounts();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const normalizedData = data.map((item) => {
    const acc =
      "accountData" in item.accountData
        ? item.accountData.accountData
        : item.accountData;
    return {
      ...item,
      ...acc,
    };
  });

  const filteredData = normalizedData.filter((item) => {
    return item.name.toLowerCase().includes(search.toLowerCase());
  });

  const paginated = filteredData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <div className="px-6 py-7 space-y-6 w-full">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">{t("title")}</h2>
        <Button
          className="bg-[#084960]"
          onClick={() => router.push("/dashboard/create-account")}
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
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]">
              <Checkbox />
            </TableHead>
            <TableHead>{t("table.accountTitle")}</TableHead>
            <TableHead>{t("table.createdBy")}</TableHead>
            <TableHead>{t("table.createdAt")}</TableHead>
            <TableHead>{t("table.crm")}</TableHead>
            <TableHead className="text-right">{t("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.map((acc) => (
            <TableRow key={acc.id}>
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell className="flex items-center gap-2">
                {acc.logo && (
                  <img src={acc.logo} alt="logo" className="w-6 h-6" />
                )}{" "}
                {acc.name}
              </TableCell>
              <TableCell>{acc.createdBy || "Unknown"}</TableCell>
              <TableCell>
                {format(
                  new Date(acc.createdAt || new Date()),
                  "dd/MM/yyyy, HH:mm"
                )}
              </TableCell>
              <TableCell>
                <span className="text-xs text-gray-500">
                  {acc.synced ? "✔️" : "❌"}
                </span>
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button size="icon" variant="ghost">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="ghost">
                  <Trash className="w-4 h-4 text-red-500" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between pt-4">
        <div className="text-sm flex gap-2 items-center">
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
          page={page - 1}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          totalCount={filteredData.length}
        />
      </div>
    </div>
  );
};

export default AccountListPage;
