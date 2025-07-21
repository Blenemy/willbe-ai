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
  useBulkUpdateMessageEntryLeads,
  useDeleteMessageCampaignEntry,
  useUpdateMessageEntryLead,
} from "@/hooks/useMessageCampaignEntries";
import {
  useGenerateMessages,
  useSendMessages,
} from "@/hooks/useGenerateMessages";
import { useParams, useRouter } from "next/navigation";
import { CustomPagination } from "@/components/CustomPagination/CustomPagination";
import { ExportCsvButtons } from "./ExportCsvButtons";
import { EditMessageModal } from "./EditMessageModal";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";
import { useSearchLeadField } from "@/hooks/useLeadFieldSearch";
import { useSearchLanguage } from "@/hooks/useSearchLanguage";
import { renderHeader } from "@/components/ui/renderHeader";

interface Props {
  leads: MessageEntryData[];
  selectedEntry: MessageEntry;
}

type SortableKey = "firstName" | "lastname";

export const stripHtml = (html: string) => {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent?.replace(/\s+/g, " ").trim() ?? "";
};

const ITEMS_PER_PAGE = 5;

export const CreateScenarioTable = ({ leads, selectedEntry }: Props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLeadId, setModalLeadId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<MessageEntryData | null>(
    null
  );
  const router = useRouter();
  const t = useTranslations("messageScenarioData");
  const [selected, setSelected] = useState<string[]>([]);
  const [editedLeads, setEditedLeads] = useState<
    Record<string, Partial<MessageEntryData>>
  >({});
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(ITEMS_PER_PAGE);

  const { mutate: updateLead } = useUpdateMessageEntryLead();
  const { mutate: bulkUpdateLeads } = useBulkUpdateMessageEntryLeads();
  const { mutate: deleteLeads } = useDeleteMessageCampaignEntry();
  const { mutate: generateMessages, isPending: isGenerating } =
    useGenerateMessages();
  const { mutateAsync: sendMessages } = useSendMessages();
  const { mutate: searchField, isPending } = useSearchLeadField();
  const { mutate: searchLanguage, isPending: isSearchingLanguage } =
    useSearchLanguage();
  const [loadingLanguageId, setLoadingLanguageId] = useState<string | null>(
    null
  );
  const [loadingField, setLoadingField] = useState<{
    leadId: string;
    field: "email" | "phone";
  } | null>(null);
  const params = useParams();
  const id = params?.id as string;
  const [sortKey, setSortKey] = useState<SortableKey | "">("");
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (key: SortableKey) => {
    if (sortKey === key) {
      setSortAsc((prev) => !prev);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const toggleSelection = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSendMessages = async () => {
    try {
      await sendMessages({ messageEntryDataIds: selected });
      setSelected([]);
    } catch (error) {
      console.log(error);
    }
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
    if (!changes) return;

    const payload = Object.fromEntries(
      Object.entries(changes).map(([key, value]) => {
        if ((key === "email" || key === "phone") && value === "") {
          return [key, null];
        }
        return [key, value];
      })
    );

    updateLead({
      leadId,
      ...payload,
    });

    setEditedLeads((prev) => {
      const updated = { ...prev };
      delete updated[leadId];
      return updated;
    });
  };

  const handleLeadClick = (leadId: string) => {
    router.replace(`/dashboard/lead-page/${leadId}`);
  };

  const filteredLeads = useMemo(() => {
    return leads?.filter(
      (lead) =>
        lead.firstName?.toLowerCase().includes(search.toLowerCase()) ||
        lead.lastname?.toLowerCase().includes(search.toLowerCase()) ||
        lead.email?.toLowerCase().includes(search.toLowerCase()) ||
        lead.role?.toLowerCase().includes(search.toLowerCase())
    );
  }, [leads, search]);

  const sortedLeads = useMemo(() => {
    if (!sortKey) return filteredLeads;

    const sorted = [...filteredLeads].sort((a, b) => {
      const valA = a[sortKey]?.toLowerCase?.() ?? "";
      const valB = b[sortKey]?.toLowerCase?.() ?? "";
      return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });

    return sorted;
  }, [filteredLeads, sortKey, sortAsc]);

  const indexOfFirstItem = currentPage * rowsPerPage;
  const indexOfLastItem = indexOfFirstItem + rowsPerPage;
  const paginatedLeads = sortedLeads?.slice(indexOfFirstItem, indexOfLastItem);

  if (!leads || leads.length === 0) return null;

  const currentPageIds = paginatedLeads.map((item) => item.id);

  const isAllSelectedOnPage = currentPageIds.every((id) =>
    selected.includes(id)
  );

  const handleToggleSelectAll = () => {
    if (isAllSelectedOnPage) {
      setSelected([]);
    } else {
      setSelected(paginatedLeads.map((lead) => lead.id));
    }
  };

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
            <TableHead className="w-[40px] align-middle">
              <div className="flex items-center justify-center h-6">
                <Checkbox
                  checked={isAllSelectedOnPage}
                  onCheckedChange={handleToggleSelectAll}
                />
              </div>
            </TableHead>
            {renderHeader(
              t("table.firstName"),
              "firstName",
              sortKey,
              sortAsc,
              handleSort
            )}
            {renderHeader(
              t("table.lastName"),
              "lastname",
              sortKey,
              sortAsc,
              handleSort
            )}
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
                <TableCell className="w-[40px] align-middle">
                  <div className="flex items-center justify-center h-6">
                    <Checkbox
                      checked={selected.includes(lead.id)}
                      onCheckedChange={() => toggleSelection(lead.id)}
                      aria-label="Select row"
                    />
                  </div>
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
                      disabled={isPending}
                      onClick={() => {
                        setLoadingField({ leadId: lead.id, field: "email" });
                        searchField(
                          { entryIds: [lead.id], field: "email" },
                          {
                            onSettled: () => setLoadingField(null),
                          }
                        );
                      }}
                    >
                      {loadingField?.leadId === lead.id &&
                      loadingField?.field === "email" ? (
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
                      disabled={isPending}
                      onClick={() => {
                        setLoadingField({ leadId: lead.id, field: "phone" });
                        searchField(
                          { entryIds: [lead.id], field: "phone" },
                          {
                            onSettled: () => setLoadingField(null),
                          }
                        );
                      }}
                    >
                      {loadingField?.leadId === lead.id &&
                      loadingField?.field === "phone" ? (
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
                      if (selected.length >= 2 && selected.includes(lead.id)) {
                        bulkUpdateLeads({
                          leadIds: selected,
                          messageStructureId: val,
                        });
                      } else {
                        updateLead({
                          leadId: lead.id,
                          messageStructureId: val,
                        });
                      }
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
                <TableCell className="align-middle">
                  <div className="flex items-center gap-2">
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

                    <Button
                      size="icon"
                      variant="ghost"
                      disabled={isSearchingLanguage}
                      onClick={() => {
                        setLoadingLanguageId(lead.id);
                        searchLanguage(
                          { messageEntryLeadDataId: lead.id },
                          {
                            onSettled: () => setLoadingLanguageId(null),
                          }
                        );
                      }}
                    >
                      {loadingLanguageId === lead.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
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
                      {stripHtml(lead.message ?? "").slice(0, 60) ||
                        t("placeholders.message")}
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
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleLeadClick(lead.leadId)}
                  >
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
          <Select
            onValueChange={(val) => {
              setRowsPerPage(Number(val));
              setCurrentPage(0);
            }}
          >
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
          disabled={selected.length === 0 || isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              {t("buttons.generating")}
            </>
          ) : (
            t("buttons.generate")
          )}
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
