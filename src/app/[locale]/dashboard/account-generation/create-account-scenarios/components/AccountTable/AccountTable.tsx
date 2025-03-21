"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { useAccountScenarios } from "@/hooks/useAccountScenarios";

const AccountTable = () => {
  const searchParams = useSearchParams();
  const accountId = searchParams.get("accountId");

  const { accountsSearchData } = useAccountScenarios({
    enableFetch: true,
    accountId,
  });

  return (
    <div className="w-full px-6 py-10 flex flex-col">
      <h2 className="mb-5 font-semibold text-2xl">Company List</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Logo</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Industry</TableHead>
            <TableHead>Headcount</TableHead>
            <TableHead>LinkedIn</TableHead>
            <TableHead>Summary</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accountsSearchData?.map((company) => (
            <TableRow key={company.id}>
              <TableCell>
                {company.logo && (
                  <Image
                    src={company.logo}
                    alt={company.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                )}
              </TableCell>
              <TableCell>{company.name}</TableCell>
              <TableCell>{company.industry || "-"}</TableCell>
              <TableCell>{company.headcount || "-"}</TableCell>
              <TableCell>
                {company.profile_url && (
                  <a
                    href={company.profile_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    LinkedIn <ExternalLink size={16} />
                  </a>
                )}
              </TableCell>
              <TableCell className="max-w-[400px] whitespace-pre-line">
                {company.summary?.slice(0, 300) + "..."}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AccountTable;
