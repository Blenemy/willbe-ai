"use client";

import { useState, Fragment } from "react";
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
import { useStatisticMessages } from "@/hooks/useStatisticMessages";
import { useParams } from "next/navigation";

function formatMessageType(status: string): string {
  switch (status.toLowerCase()) {
    case "follow_up":
    case "follow up":
    case "follow_up_email":
    case "follow up email":
      return "Follow up email";
    case "connection":
    case "linkedin":
    case "linkedin_connection":
      return "LinkedIn Connection";
    case "email":
      return "Email";
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
}

function htmlToPlainText(html: string): string {
  if (typeof window === "undefined") return html;

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  return doc.body.textContent?.trim() ?? html;
}

export const StatisticsMessagesTable = () => {
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  const params = useParams();
  const scenarioId = params?.id as string;

  const { data = [] } = useStatisticMessages(scenarioId);

  const filtered = data.filter((item) => {
    const fullName =
      `${item.leadData.first_name} ${item.leadData.last_name}`.toLowerCase();
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
          placeholder="Search by full name"
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
            <TableHead>Full name</TableHead>
            <TableHead>Message status</TableHead>
            <TableHead>Account</TableHead>
            <TableHead>Last message sent</TableHead>
            <TableHead className="text-right">Read</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.map((item) => {
            const sent = item.sentMessages?.[0];
            const leadData = item.leadData;
            return (
              <Fragment key={item.id}>
                <TableRow
                  className="cursor-pointer hover:bg-accent"
                  onClick={() =>
                    setExpandedRowId((prev) =>
                      prev === item.id ? null : item.id
                    )
                  }
                >
                  <TableCell>{`${leadData.first_name} ${leadData.last_name}`}</TableCell>
                  <TableCell>{sent?.status || "-"}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={leadData.profile_picture_url} />
                      <AvatarFallback>{leadData.first_name[0]}</AvatarFallback>
                    </Avatar>
                    {leadData.headline}
                  </TableCell>
                  <TableCell>
                    {sent?.sentAt
                      ? new Date(sent.sentAt).toLocaleString()
                      : "-"}
                  </TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>

                {expandedRowId === item.id && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="bg-muted p-4 text-sm text-muted-foreground"
                    >
                      <div className="space-y-6">
                        <div>
                          <div className="font-semibold mb-3">
                            Messages received
                          </div>

                          <div className="grid grid-cols-3 mb-2 gap-4">
                            <div>Message received</div>
                            <div>Message type</div>
                            <div>Date</div>
                          </div>

                          {item.receivedMessages.length > 0 ? (
                            item.receivedMessages.map((msg) => (
                              <div
                                key={msg.id}
                                className="grid grid-cols-3 border-t border-border py-2 text-muted-foreground gap-4"
                              >
                                <div>LinkedIn Connection Sent without text</div>
                                <div>LinkedIn Connection</div>
                                <div>—</div>
                              </div>
                            ))
                          ) : (
                            <div className="text-xs italic text-gray-500">
                              No received messages
                            </div>
                          )}
                        </div>

                        <div>
                          <div className="font-semibold mb-3">
                            Messages sent
                          </div>

                          <div className="grid grid-cols-3 mb-2 gap-4">
                            <div>Message sent</div>
                            <div>Message type</div>
                            <div>Date</div>
                          </div>

                          {item.sentMessages.length > 0 ? (
                            item.sentMessages.map((msg) => (
                              <div
                                key={msg.id}
                                className="grid grid-cols-3 border-t border-border py-2 text-muted-foreground gap-4"
                              >
                                <div className="whitespace-pre-wrap">
                                  {htmlToPlainText(msg.message || "—")}
                                </div>
                                <div>{formatMessageType(msg.status)}</div>
                                <div>
                                  {msg.sentAt
                                    ? new Date(msg.sentAt).toLocaleString()
                                    : "—"}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-xs italic text-gray-500">
                              No sent messages
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            );
          })}
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
