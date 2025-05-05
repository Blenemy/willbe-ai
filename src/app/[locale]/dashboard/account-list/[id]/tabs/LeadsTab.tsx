"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, Eye } from "lucide-react";

interface Lead {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
}

export const LeadsTab = ({ leads }: { leads: Lead[] }) => {
  return (
    <div className="mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>First name</TableHead>
            <TableHead>Last name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow key={lead.id}>
              <TableCell>
                <input type="checkbox" />
              </TableCell>
              <TableCell>{lead.firstName}</TableCell>
              <TableCell>{lead.lastName}</TableCell>
              <TableCell>{lead.email}</TableCell>
              <TableCell>{lead.phone}</TableCell>
              <TableCell>{lead.role}</TableCell>
              <TableCell className="flex gap-2 justify-end">
                <Eye className="w-4 h-4 cursor-pointer" />
                <Trash2 className="w-4 h-4 cursor-pointer text-red-500" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-end mt-4">
        <Button onClick={() => alert("Redirect to Add Lead page")}>
          Add lead
        </Button>
      </div>
    </div>
  );
};
