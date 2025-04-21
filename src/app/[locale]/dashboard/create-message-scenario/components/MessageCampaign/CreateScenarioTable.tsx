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
import { Trash2, Eye, Search } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  MessageEntryData,
  useDeleteMessageCampaignEntry,
  useUpdateMessageEntryLead,
} from "@/hooks/useMessageCampaignEntries";
import {
  useGenerateMessages,
  useSendMessages,
} from "@/hooks/useGenerateMessages";
import { useParams } from "next/navigation";

interface Props {
  leads: MessageEntryData[];
}

export const CreateScenarioTable = ({ leads }: Props) => {
  const t = useTranslations("messageScenarioData");
  const [selected, setSelected] = useState<string[]>([]);
  const [editedLeads, setEditedLeads] = useState<
    Record<string, Partial<MessageEntryData>>
  >({});
  const { mutate: updateLead } = useUpdateMessageEntryLead();
  const { mutate: deleteLeads } = useDeleteMessageCampaignEntry();
  const { mutate: generateMessages } = useGenerateMessages();
  const { mutate: sendMessages } = useSendMessages();
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

  if (!leads || leads.length === 0) return null;

  return (
    <div className="space-y-4">
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
          {leads.map((lead) => {
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
                <TableCell className="flex items-center gap-2">
                  <Input
                    value={changes.email ?? lead.email ?? ""}
                    onChange={(e) =>
                      handleChange(lead.id, "email", e.target.value)
                    }
                    onBlur={() => handleBlur(lead.id)}
                    placeholder={t("placeholders.email")}
                  />
                  {!lead.email && (
                    <Button size="icon" variant="ghost">
                      <Search className="w-4 h-4" />
                    </Button>
                  )}
                </TableCell>
                <TableCell>
                  <Input
                    value={changes.phone ?? lead.phone ?? ""}
                    onChange={(e) =>
                      handleChange(lead.id, "phone", e.target.value)
                    }
                    onBlur={() => handleBlur(lead.id)}
                    placeholder={t("placeholders.phone")}
                  />
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
                  <Input
                    value={changes.message ?? lead.message ?? ""}
                    onChange={(e) =>
                      handleChange(lead.id, "message", e.target.value)
                    }
                    onBlur={() => handleBlur(lead.id)}
                    placeholder={t("placeholders.message")}
                  />
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteLeads(lead.leadId)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <div className="flex justify-between pt-4">
        <Button
          onClick={() => generateMessages({ messageEntryDataIds: selected })}
          disabled={selected.length === 0}
        >
          {t("buttons.generate")}
        </Button>
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
