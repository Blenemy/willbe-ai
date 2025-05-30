"use client";

import { useState, Fragment, useMemo } from "react";
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
import { Info, ExternalLink, ChevronDown, CheckCircle } from "lucide-react";
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
import { renderHeader } from "@/components/ui/renderHeader";
import { useTranslations } from "next-intl";

const MESSAGE_STATUS = {
  responded: "Responded",
  not_answered: " Not answered",
} as const;

type MessageStatusKey = keyof typeof MESSAGE_STATUS;

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

type SortKey = "name" | "account" | "date" | "";

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
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("");
  const [sortAsc, setSortAsc] = useState(true);
  const t = useTranslations("statisticsPage.messagesTable");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc((prev) => !prev);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const params = useParams();
  const scenarioId = params?.id as string;

  const { data = [] } = useStatisticMessages(scenarioId);

  const sorted = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const nameA = `${a.leadData.first_name} ${a.leadData.last_name}`;
      const nameB = `${b.leadData.first_name} ${b.leadData.last_name}`;
      const accountA = a.leadData.headline || "";
      const accountB = b.leadData.headline || "";
      const dateA = a.sentMessages?.[0]?.sentAt || "";
      const dateB = b.sentMessages?.[0]?.sentAt || "";

      let valA = "",
        valB = "";
      if (sortKey === "name") [valA, valB] = [nameA, nameB];
      if (sortKey === "account") [valA, valB] = [accountA, accountB];
      if (sortKey === "date") [valA, valB] = [dateA, dateB];

      return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });
  }, [data, sortKey, sortAsc]);

  const filtered = useMemo(() => {
    return sorted.filter((item) => {
      const fullName =
        `${item.leadData.first_name} ${item.leadData.last_name}`.toLowerCase();
      const matchesSearch = fullName.includes(search.trim().toLowerCase());
      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [sorted, search, statusFilter]);

  const paginated = useMemo(() => {
    return filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <Input
          placeholder={t("searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
        />
        <Select
          value={statusFilter}
          onValueChange={(val) => setStatusFilter(val)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="responded">Responded</SelectItem>
            <SelectItem value="not_answered">Not answered</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            {renderHeader(
              t("columns.fullName"),
              "name",
              sortKey,
              sortAsc,
              handleSort
            )}
            <TableHead>{t("columns.messageStatus")}</TableHead>
            {renderHeader(
              t("columns.account"),
              "account",
              sortKey,
              sortAsc,
              handleSort
            )}
            {renderHeader(
              t("columns.lastMessageSent"),
              "date",
              sortKey,
              sortAsc,
              handleSort
            )}
            <TableHead className="text-right">{t("columns.read")}</TableHead>
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
                  <TableCell className="flex items-center gap-2">
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        expandedRowId === item.id ? "rotate-180" : "rotate-0"
                      }`}
                    />
                    {`${leadData.first_name} ${leadData.last_name}`}
                  </TableCell>
                  <TableCell>
                    {MESSAGE_STATUS[item.status as MessageStatusKey]}
                  </TableCell>
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
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const url = leadData.public_profile_url;
                        if (url) window.open(url, "_blank");
                      }}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>

                    {item.isSent ? (
                      <Button variant="ghost" size="icon" aria-label="Info">
                        <CheckCircle className="text-green-600 w-4 h-4 mx-auto" />
                      </Button>
                    ) : (
                      <Button variant="ghost" size="icon" aria-label="Info">
                        <Info className="text-red-600 w-4 h-4 mx-auto" />
                      </Button>
                    )}
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
                            {t("receivedTitle")}
                          </div>

                          <div className="grid grid-cols-3 mb-2 gap-4">
                            <div>{t("columns.messageReceived")}</div>
                            <div>{t("columns.messageType")}</div>
                            <div>{t("columns.date")}</div>
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
                              {t("noReceived")}
                            </div>
                          )}
                        </div>

                        <div>
                          <div className="font-semibold mb-3">
                            {t("sentTitle")}
                          </div>

                          <div className="grid grid-cols-3 mb-2 gap-4">
                            <div>{t("columns.messageReceived")}</div>
                            <div>{t("columns.messageType")}</div>
                            <div>{t("columns.date")}</div>
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
                              {t("noSent")}
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
          totalCount={filtered.length}
          rowsPerPage={rowsPerPage}
        />
      </div>
    </div>
  );
};
