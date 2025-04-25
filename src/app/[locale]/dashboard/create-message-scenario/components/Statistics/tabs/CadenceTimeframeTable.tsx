"use client";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { CheckCircle } from "lucide-react";
import { CustomPagination } from "@/components/CustomPagination/CustomPagination";
import { useCadenceTimeframe } from "@/hooks/useCadenceTimeframe";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { useTranslations } from "next-intl";

export const CadenceTimeframeTable = () => {
  const t = useTranslations("statisticsPage.cadenceTable");
  const { id: scenarioId } = useParams();
  const { data = [] } = useCadenceTimeframe(scenarioId as string);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const paginated = data.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("cadenceType")}</TableHead>
            <TableHead>{t("structure")}</TableHead>
            <TableHead>{t("mailsSent")}</TableHead>
            <TableHead>{t("meetingRate")}</TableHead>
            <TableHead>{t("responseRate")}</TableHead>
            <TableHead>{t("outOfOfficeRate")}</TableHead>
            <TableHead>{t("bounceRate")}</TableHead>
            <TableHead>{t("dateToBeSent")}</TableHead>
            <TableHead>{t("sent")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.cadenceType}</TableCell>
              <TableCell>{item.structure || t("na")}</TableCell>
              <TableCell>{item.mailsSent}</TableCell>
              <TableCell>{item.meetingRate}%</TableCell>
              <TableCell>{item.responseRate}%</TableCell>
              <TableCell>{item.outOfOfficeRate}%</TableCell>
              <TableCell>{item.bounceRate}%</TableCell>
              <TableCell>
                {format(new Date(item.dateToBeSent), "dd/MM/yy, hh:mm a")}
              </TableCell>
              <TableCell>
                {item.isSent && (
                  <CheckCircle className="text-green-600 w-4 h-4 mx-auto" />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between pt-4">
        <div className="text-sm flex gap-2 items-center">
          <span className="min-w-28">{t("rowsPerPage")}</span>
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
          totalCount={data.length}
        />
      </div>
    </div>
  );
};
