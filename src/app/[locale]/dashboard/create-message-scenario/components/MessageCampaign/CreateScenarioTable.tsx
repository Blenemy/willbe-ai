"use client";

import { useTranslations } from "next-intl";
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
import { Trash2, Sparkles, Pencil, Loader2, ExternalLink } from "lucide-react";
import { useMemo, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  MessageEntry,
  MessageEntryData,
  useDeleteMessageCampaignEntry,
  useUpdateMessageEntryLead,
} from "@/hooks/useMessageCampaignEntries";
import {
  useGenerateMessages,
  useSendMessages,
} from "@/hooks/useGenerateMessages";
import { useParams } from "next/navigation";
import { CustomPagination } from "@/components/CustomPagination/CustomPagination";
import { ExportCsvButtons } from "./ExportCsvButtons";
import { EditMessageModal } from "./EditMessageModal";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";
import { useSearchLeadField } from "@/hooks/useLeadFieldSearch";

interface Props {
  leads: MessageEntryData[];
  selectedEntry: MessageEntry;
}

const ITEMS_PER_PAGE = 5;

export const CreateScenarioTable = ({ leads, selectedEntry }: Props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLeadId, setModalLeadId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<MessageEntryData | null>(
    null
  );
  const t = useTranslations("messageScenarioData");
  const [selected, setSelected] = useState<string[]>([]);
  const [editedLeads, setEditedLeads] = useState<
    Record<string, Partial<MessageEntryData>>
  >({});
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(ITEMS_PER_PAGE);

  const { mutate: updateLead } = useUpdateMessageEntryLead();
  const { mutate: deleteLeads } = useDeleteMessageCampaignEntry();
  const { mutate: generateMessages } = useGenerateMessages();
  const { mutate: sendMessages } = useSendMessages();
  const { mutate: searchField, isPending } = useSearchLeadField();
  const params = useParams();
  const id = params?.id as string;

  const toggleSelection = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSendMessages = () => {
    sendMessages({ messageEntryDataIds: selected });
    setSelected([]);
  };

  const handleDeleteLeads = (leadId: string) => {
    deleteLeads({ leadsIds: [leadId], id });
  };

  const handleChange = (
    leadId: string,
    field: keyof MessageEntryData,
    value: string
  ) => {
    setEditedLeads((prev) => ({
      ...prev,
      [leadId]: {
        ...prev[leadId],
        [field]: value,
      },
    }));
  };

  const handleBlur = (leadId: string) => {
    const changes = editedLeads[leadId];
    if (!changes || Object.keys(changes).length === 0) return;

    updateLead({
      leadId,
      ...Object.fromEntries(
        Object.entries(changes).filter(
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          ([_, value]) => value !== undefined && value !== null && value !== ""
        )
      ),
    });

    setEditedLeads((prev) => {
      const updated = { ...prev };
      delete updated[leadId];
      return updated;
    });
  };

  const filteredLeads = useMemo(() => {
    return leads.filter(
      (lead) =>
        lead.firstName?.toLowerCase().includes(search.toLowerCase()) ||
        lead.lastname?.toLowerCase().includes(search.toLowerCase()) ||
        lead.email?.toLowerCase().includes(search.toLowerCase()) ||
        lead.role?.toLowerCase().includes(search.toLowerCase())
    );
  }, [leads, search]);

  const indexOfFirstItem = currentPage * rowsPerPage;
  const indexOfLastItem = indexOfFirstItem + rowsPerPage;
  const paginatedLeads = filteredLeads.slice(indexOfFirstItem, indexOfLastItem);

  if (!leads || leads.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search by lead first name, last name, email, or role"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />

        <ExportCsvButtons selectedEntryId={selectedEntry.id} />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead />
            <TableHead>{t("table.firstName")}</TableHead>
            <TableHead>{t("table.lastName")}</TableHead>
            <TableHead>{t("table.email")}</TableHead>
            <TableHead>{t("table.phone")}</TableHead>
            <TableHead>{t("table.account")}</TableHead>
            <TableHead>{t("table.role")}</TableHead>
            <TableHead>{t("table.messageStructure")}</TableHead>
            <TableHead>{t("table.language")}</TableHead>
            <TableHead>{t("table.product")}</TableHead>
            <TableHead>{t("table.message")}</TableHead>
            <TableHead />
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedLeads.map((lead) => {
            const changes = editedLeads[lead.id] || {};
            return (
              <TableRow key={lead.id}>
                <TableCell>
                  <Checkbox
                    checked={selected.includes(lead.id)}
                    onCheckedChange={() => toggleSelection(lead.id)}
                  />
                </TableCell>
                <TableCell>{lead.firstName}</TableCell>
                <TableCell>{lead.lastname}</TableCell>
                <TableCell className="align-middle">
                  <div className="flex items-center gap-2">
                    <Input
                      value={changes.email ?? lead.email ?? ""}
                      onChange={(e) =>
                        handleChange(lead.id, "email", e.target.value)
                      }
                      onBlur={() => handleBlur(lead.id)}
                      placeholder={t("placeholders.email")}
                      className="h-9"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() =>
                        searchField({ entryIds: [lead.id], field: "email" })
                      }
                    >
                      {isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="align-middle">
                  <div className="flex items-center gap-2">
                    <Input
                      value={changes.phone ?? lead.phone ?? ""}
                      onChange={(e) =>
                        handleChange(lead.id, "phone", e.target.value)
                      }
                      onBlur={() => handleBlur(lead.id)}
                      placeholder={t("placeholders.phone")}
                      className="h-9"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() =>
                        searchField({ entryIds: [lead.id], field: "phone" })
                      }
                    >
                      {isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <span>{lead.company}</span>
                </TableCell>
                <TableCell>
                  <span>{lead.role}</span>
                </TableCell>
                <TableCell>
                  <Select
                    value={lead.messageStructureId ?? ""}
                    onValueChange={(val) => {
                      updateLead({
                        leadId: lead.id,
                        messageStructureId: val,
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("placeholders.selectStructure")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {lead.messageStructures?.map((ms) => (
                        <SelectItem key={ms.id} value={ms.id}>
                          {ms.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Select
                    value={lead.language ?? ""}
                    onValueChange={(val) => {
                      updateLead({
                        leadId: lead.id,
                        language: val,
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("placeholders.selectLanguage")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {lead.languages?.map((lang) => (
                        <SelectItem key={lang} value={lang}>
                          {lang}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Select
                    value={lead.productServiceId ?? ""}
                    onValueChange={(val) => {
                      updateLead({
                        leadId: lead.id,
                        productServiceId: val,
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("placeholders.selectProduct")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {lead.companyProducts.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate max-w-[180px] text-sm text-muted-foreground">
                      {lead.message?.slice(0, 60) || t("placeholders.message")}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setModalLeadId(lead.id);
                        setModalOpen(true);
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </div>

                  {modalLeadId === lead.id && (
                    <EditMessageModal
                      open={modalOpen}
                      onClose={() => setModalOpen(false)}
                      initialMessage={lead.message ?? ""}
                      leadName={`${lead.firstName} ${lead.lastname}`}
                      onSave={(newMessage) => {
                        updateLead({ leadId: lead.id, message: newMessage });
                      }}
                    />
                  )}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setLeadToDelete(lead);
                      setDeleteModalOpen(true);
                    }}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>

                  {leadToDelete?.id === lead.id && (
                    <ConfirmDeleteModal
                      open={deleteModalOpen}
                      onClose={() => setDeleteModalOpen(false)}
                      leadName={`${lead.firstName} ${lead.lastname}`}
                      onConfirm={() => {
                        handleDeleteLeads(lead.leadId);
                        setDeleteModalOpen(false);
                        setLeadToDelete(null);
                      }}
                    />
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between pt-4">
        <div className="text-sm flex gap-2 items-center">
          <span className="min-w-28">{t("dropdown.rowsPerPage")}</span>
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
          page={currentPage}
          setPage={setCurrentPage}
          totalCount={filteredLeads.length}
          rowsPerPage={rowsPerPage}
        />
      </div>

      <div className="flex justify-end pt-4 gap-3">
        <Button
          disabled={selected.length === 0 || isPending}
          onClick={() => {
            searchField({ entryIds: selected, field: "email" });
          }}
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              {t("buttons.searching")}
            </>
          ) : (
            t("buttons.searchEmails")
          )}
        </Button>
        <Button
          onClick={() => generateMessages({ messageEntryDataIds: selected })}
          disabled={selected.length === 0}
        >
          {t("buttons.generate")}
        </Button>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={handleSendMessages}
          disabled={
            selected.length === 0 ||
            selected.some((id) => {
              const lead = leads.find((l) => l.id === id);
              return !lead?.message?.trim();
            })
          }
        >
          {t("buttons.send", { count: selected.length })}
        </Button>
      </div>
    </div>
  );
};
