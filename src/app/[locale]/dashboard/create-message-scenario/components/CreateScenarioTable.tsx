"use client";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2, Eye, Search } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { MessageEntryData } from "@/hooks/useMessageCampaignEntries";

interface Props {
  leads: MessageEntryData[];
  accounts: { id: string; name: string }[];
  messageStructures: { id: string; name: string; languages: string[] }[];
  products: { id: string; name: string }[];
  onGenerate: () => void;
  onSend: () => void;
}

export const CreateScenarioTable = ({
  leads,
  accounts,
  messageStructures,
  products,
  onGenerate,
  onSend,
}: Props) => {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSelection = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  if (!leads || leads.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead />
            <TableHead>First name</TableHead>
            <TableHead>Last name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Account</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Message structure</TableHead>
            <TableHead>Language</TableHead>
            <TableHead>Product/Service</TableHead>
            <TableHead>Message</TableHead>
            <TableHead />
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow key={lead.id}>
              <TableCell>
                <Checkbox
                  checked={selected.includes(lead.id)}
                  onCheckedChange={() => toggleSelection(lead.id)}
                />
              </TableCell>
              <TableCell>{lead.firstName}</TableCell>
              <TableCell>{lead.lastname}</TableCell>
              <TableCell className="flex items-center gap-2">
                <Input value={lead.email || ""} placeholder="Email" />
                {!lead.email && (
                  <Button size="icon" variant="ghost">
                    <Search className="w-4 h-4" />
                  </Button>
                )}
              </TableCell>
              <TableCell>
                <Input value={lead.phone || ""} placeholder="Phone" />
              </TableCell>
              <TableCell>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((acc) => (
                      <SelectItem key={acc.id} value={acc.id}>
                        {acc.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Input value={lead.role || ""} placeholder="Role" />
              </TableCell>
              <TableCell>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select structure" />
                  </SelectTrigger>
                  <SelectContent>
                    {messageStructures.map((ms) => (
                      <SelectItem key={ms.id} value={ms.id}>
                        {ms.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Input value={lead.message || ""} placeholder="Message" />
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon">
                  <Eye className="w-4 h-4" />
                </Button>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon">
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between pt-4">
        <Button onClick={onGenerate} disabled={selected.length === 0}>
          Generate message(s)
        </Button>
        <Button onClick={onSend} disabled={selected.length === 0}>
          Send {selected.length} message(s)
        </Button>
      </div>
    </div>
  );
};
