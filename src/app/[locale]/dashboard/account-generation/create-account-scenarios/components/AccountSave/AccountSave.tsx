"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSavedAccounts } from "@/hooks/useSavedAccounts";
import { useGenerateLeadScenario } from "@/hooks/useGenerateLeadScenario";
import { useTranslations } from "next-intl";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import linkedinImage from "@/assets/LinkedinLogo.svg";

const AccountSave = () => {
  const t = useTranslations("accountSave");
  // const router = useRouter();

  const searchParams = useSearchParams();
  const accountId = searchParams.get("accountId");
  const { savedAccounts } = useSavedAccounts({
    enableFetch: true,
    accountId,
  });
  const { generateLeadScenario } = useGenerateLeadScenario();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // const handleDelete = async (id: string) => {
  //   deleteSavedAccounts(id);
  // };

  // const handleOpenProfile = (id: string) => {
  //   router.replace(`/dashboard/account-list/${id}`);
  // };

  const handleGenerateScenario = () => {
    generateLeadScenario({
      accountScenarioId: accountId,
      accountIds: selectedIds,
    });
  };

  if (!savedAccounts) {
    return null;
  }

  return (
    <div className="w-full px-6 py-10 flex flex-col gap-4">
      <h2 className="text-2xl font-semibold">{t("title")}</h2>

      <Table className="table-fixed text-sm border-separate border-spacing-y-1 compact-table">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[36px] p-1" />
            <TableHead className="w-[44px] p-1">{t("table.logo")}</TableHead>
            <TableHead className="w-[120px] truncate">
              {t("table.title")}
            </TableHead>
            <TableHead className="w-[120px] truncate">
              {t("table.industry")}
            </TableHead>
            <TableHead className="w-[60px] truncate">
              {t("table.employees")}
            </TableHead>
            <TableHead className="w-[90px] truncate">
              {t("table.linkedin")}
            </TableHead>
            <TableHead className="w-[320px] truncate hidden md:table-cell">
              {t("table.description")}
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {savedAccounts.map((item) => {
            const data = item.accountData;
            return (
              <TableRow key={item.id}>
                <TableCell className="w-[36px] p-1">
                  <Checkbox
                    checked={selectedIds.includes(item.id)}
                    onCheckedChange={() => toggleSelection(item.id)}
                  />
                </TableCell>

                <TableCell className="w-[44px] p-1">
                  {data.logo && (
                    <Image
                      src={data.logo}
                      alt={data.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  )}
                </TableCell>

                <TableCell className="w-[120px] truncate">
                  {data.name}
                </TableCell>
                <TableCell className="w-[120px] truncate">
                  {data.industry}
                </TableCell>
                <TableCell className="w-[60px] truncate">
                  {data.headcount}
                </TableCell>

                <TableCell className="w-[90px] truncate">
                  {data.profile_url && (
                    <a
                      href={data.profile_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-[2px]"
                    >
                      <Image
                        src={linkedinImage}
                        alt="LinkedIn"
                        width={16}
                        height={16}
                      />
                    </a>
                  )}
                </TableCell>

                <TableCell className="w-[320px] truncate hidden md:table-cell">
                  <TooltipProvider delayDuration={200}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-help inline-block max-w-full truncate">
                          {data.summary?.slice(0, 120) + "..."}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
                        className="max-w-sm whitespace-pre-line break-words"
                      >
                        {data.summary}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {selectedIds.length > 0 && (
        <Button className="self-center mt-4" onClick={handleGenerateScenario}>
          {t("generateScenario")}
        </Button>
      )}
    </div>
  );
};

export default AccountSave;
