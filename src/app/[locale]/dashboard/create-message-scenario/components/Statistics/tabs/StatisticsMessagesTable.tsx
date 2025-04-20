"use client";

import { useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash2, Pencil } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustomPagination } from "@/components/CustomPagination/CustomPagination";

const mockData = [
  {
    id: "1",
    firstName: "David",
    lastName: "Reezy",
    account: {
      name: "CPL/Paragen Activities",
      logo: "/logo1.png",
    },
    status: "Responded",
    lastMessageDate: "03/14/25, 12:54 pm",
  },
  {
    id: "2",
    firstName: "Jules",
    lastName: "Taylor",
    account: {
      name: "Bionic",
      logo: "/logo2.png",
    },
    status: "Responded",
    lastMessageDate: "03/14/25, 12:54 pm",
  },
  {
    id: "3",
    firstName: "Sandra",
    lastName: "Klinski",
    account: {
      name: "Learning Edge, LLC",
      logo: "/logo3.png",
    },
    status: "Responded",
    lastMessageDate: "03/14/25, 12:54 pm",
  },
];

export const StatisticsMessagesTable = () => {
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);

  const filtered = mockData.filter((item) => {
    const fullName = `${item.firstName} ${item.lastName}`.toLowerCase();
    return fullName.includes(search.trim().toLowerCase());
  });

  const paginated = filtered.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search by first name, last name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select onValueChange={(val) => setRowsPerPage(Number(val))}>
          <SelectTrigger className="w-28">
            <SelectValue placeholder={String(rowsPerPage)} />
          </SelectTrigger>
          <SelectContent>
            {[5, 10, 20].map((v) => (
              <SelectItem key={v} value={String(v)}>
                {v} rows
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>First name</TableHead>
            <TableHead>Last name</TableHead>
            <TableHead>Message status</TableHead>
            <TableHead>Account</TableHead>
            <TableHead>Last message received date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.firstName}</TableCell>
              <TableCell>{item.lastName}</TableCell>
              <TableCell>{item.status}</TableCell>
              <TableCell className="flex items-center gap-2">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={item.account.logo} />
                  <AvatarFallback>{item.account.name[0]}</AvatarFallback>
                </Avatar>
                {item.account.name}
              </TableCell>
              <TableCell>{item.lastMessageDate}</TableCell>
              <TableCell className="flex justify-end gap-2">
                <Button variant="ghost" size="icon">
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-end">
        <CustomPagination
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          totalCount={filtered.length}
        />
      </div>
    </div>
  );
};
