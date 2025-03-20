"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLeadScenarios } from "@/hooks/useLeadScenarious";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

const LeadTable = () => {
  const searchParams = useSearchParams();
  const scenarioId = searchParams.get("scenarioId");

  const { leads } = useLeadScenarios({
    enableFetch: true,
    scenarioId,
    fetchLeads: true,
  });

  return (
    <div className="w-full px-6 py-10 flex flex-col">
      <h2 className="mb-5 font-semibold text-2xl">Lead Scenarios</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Job Title</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>LinkedIn</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads?.map((lead) => (
            <TableRow key={lead.id}>
              <TableCell>
                {lead.profile_picture_url && (
                  <Image
                    src={lead.profile_picture_url}
                    alt={lead.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                )}
              </TableCell>
              <TableCell>{lead.first_name}</TableCell>
              <TableCell>{lead.last_name}</TableCell>
              <TableCell>{lead.current_positions?.[0]?.role || "-"}</TableCell>
              <TableCell>{lead.location}</TableCell>
              <TableCell>
                {lead.current_positions?.[0]?.company || "-"}
              </TableCell>
              <TableCell>
                {lead.public_profile_url && (
                  <a
                    href={lead.public_profile_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    LinkedIn <ExternalLink size={16} />
                  </a>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeadTable;
