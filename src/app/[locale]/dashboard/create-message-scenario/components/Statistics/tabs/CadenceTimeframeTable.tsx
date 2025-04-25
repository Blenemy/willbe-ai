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
// import { useCadenceTimeframe } from "@/hooks/useCadenceTimeframe";
// import { useParams } from "next/navigation";
import { format } from "date-fns";

const mockData = Array.from({ length: 11 }, (_, i) => ({
  id: `item-${i + 1}`,
  cadenceType:
    i === 0
      ? "LinkedIn Connection"
      : i === 10
      ? "First email"
      : "Follow up email",
  structure: "FuP [Objective]",
  mailsSent: 85,
  meetingRate: 12,
  responseRate: 48,
  outOfOfficeRate: 19,
  bounceRate: 31,
  dateToBeSent: new Date(2025, 6, 4, 11, 52), // 07/04/25 11:52am
  isSent: true,
}));

export const CadenceTimeframeTable = () => {
  // const { id: scenarioId } = useParams();
  // const {
  //   data = [],
  //   isLoading,
  //   error,
  // } = useCadenceTimeframe(scenarioId as string);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const paginated = mockData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cadence type</TableHead>
            <TableHead>Structure</TableHead>
            <TableHead>Mails sent</TableHead>
            <TableHead>Meeting rate</TableHead>
            <TableHead>Response rate</TableHead>
            <TableHead>Out-of-office rate</TableHead>
            <TableHead>Bounce rate</TableHead>
            <TableHead>Date to be sent</TableHead>
            <TableHead>Sent</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.cadenceType}</TableCell>
              <TableCell>{item.structure}</TableCell>
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
          <span className="min-w-28">Rows per page</span>
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
          totalCount={mockData.length}
        />
      </div>
    </div>
  );
};
