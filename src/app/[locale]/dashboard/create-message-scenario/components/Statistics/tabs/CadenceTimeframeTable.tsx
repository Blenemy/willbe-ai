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

interface CadenceItem {
  id: string;
  type: string;
  structure: string;
  mailsSent: number;
  meetingRate: string;
  responseRate: string;
  outOfOfficeRate: string;
  bounceRate: string;
  sendDate: string;
  sent: boolean;
}

const mockCadences: CadenceItem[] = [
  {
    id: "1",
    type: "LinkedIn Connection",
    structure: "FuP [Objective]",
    mailsSent: 85,
    meetingRate: "12%",
    responseRate: "48%",
    outOfOfficeRate: "19%",
    bounceRate: "31%",
    sendDate: "07/4/25, 11:52 am",
    sent: true,
  },
  ...Array(4)
    .fill(0)
    .map((_, i) => ({
      id: `${i + 2}`,
      type: "Follow up email",
      structure: "FuP [Objective]",
      mailsSent: 85,
      meetingRate: "12%",
      responseRate: "48%",
      outOfOfficeRate: "19%",
      bounceRate: "31%",
      sendDate: "07/4/25, 11:52 am",
      sent: true,
    })),
];

export const CadenceTimeframeTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const paginated = mockCadences.slice(
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
              <TableCell>{item.type}</TableCell>
              <TableCell>{item.structure}</TableCell>
              <TableCell>{item.mailsSent}</TableCell>
              <TableCell>{item.meetingRate}</TableCell>
              <TableCell>{item.responseRate}</TableCell>
              <TableCell>{item.outOfOfficeRate}</TableCell>
              <TableCell>{item.bounceRate}</TableCell>
              <TableCell>{item.sendDate}</TableCell>
              <TableCell>
                {item.sent && (
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
          totalCount={mockCadences.length}
        />
      </div>
    </div>
  );
};
