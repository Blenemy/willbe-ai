"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ExternalLink } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useSearchLeads } from "@/hooks/useSearchLeads";
import Image from "next/image";
import { useSavedLeads } from "@/hooks/useSavedLeads";

const INITIAL_NUMBER_ITEMS_PER_PAGE = 10;

const LeadTable = () => {
  const searchParams = useSearchParams();
  const scenarioId = searchParams.get("scenarioId") || "";

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [cursorStack, setCursorStack] = useState<(string | null)[]>([null]);
  const [currentCursorIndex, setCurrentCursorIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(
    INITIAL_NUMBER_ITEMS_PER_PAGE
  );
  const { saveSelectedLeads } = useSavedLeads({
    enableFetch: true,
    scenarioId,
  });

  const currentCursor = cursorStack[currentCursorIndex];

  const { searchLeads, paging, cursor } = useSearchLeads({
    enableFetch: true,
    scenarioId,
    limit: itemsPerPage,
    cursor: currentCursor,
  });

  const totalPages = paging
    ? Math.ceil(paging.total_count / paging.page_count)
    : 1;

  const currentPage = paging
    ? Math.floor(paging.start / paging.page_count) + 1
    : 1;

  const toggleLeadSelection = (id: string) => {
    setSelectedLeads((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleLimitChange = (value: string) => {
    const newLimit = parseInt(value);
    setItemsPerPage(newLimit);
    setCursorStack([null]);
    setCurrentCursorIndex(0);
  };

  const handleNext = () => {
    if (cursor) {
      setCursorStack((prev) => [...prev, cursor]);
      setCurrentCursorIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentCursorIndex > 0) {
      setCurrentCursorIndex((prev) => prev - 1);
    }
  };

  const filteredLeads = searchLeads.filter((lead) =>
    lead.first_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = () => {
    const selectedData = searchLeads.filter((item) =>
      selectedLeads.includes(item.id)
    );

    const payload = selectedData.map((lead) => ({
      type: lead.type,
      id: lead.id,
      industry: lead.industry,
      name: lead.name,
      first_name: lead.first_name,
      last_name: lead.last_name,
      member_urn: lead.member_urn,
      public_identifier: lead.public_identifier,
      public_profile_url: lead.public_profile_url,
      profile_url: lead.profile_url,
      profile_picture_url: lead.profile_picture_url,
      profile_picture_url_large: lead.profile_picture_url_large,
      network_distance: lead.network_distance,
      location: lead.location,
      headline: lead.headline,
      summary: lead.summary,
      pending_invitation: lead.pending_invitation,
      current_positions: lead.current_positions,
    }));

    saveSelectedLeads({ scenarioId, leads: payload });
  };

  return (
    <div className="w-full px-6 py-10 flex flex-col gap-4">
      <h2 className="font-semibold text-2xl">Lead List</h2>

      <div className="flex items-center gap-4">
        <Select
          value={itemsPerPage.toString()}
          onValueChange={(value) => handleLimitChange(value)}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Items per page" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="25">25</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="Search by first name..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentCursorIndex(0);
            setCursorStack([null]);
          }}
          className="max-w-md"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Checkbox
                checked={
                  filteredLeads.length > 0 &&
                  filteredLeads.every((l) => selectedLeads.includes(l.id))
                }
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedLeads((prev) => [
                      ...new Set([...prev, ...filteredLeads.map((l) => l.id)]),
                    ]);
                  } else {
                    setSelectedLeads((prev) =>
                      prev.filter(
                        (id) => !filteredLeads.some((l) => l.id === id)
                      )
                    );
                  }
                }}
              />
            </TableHead>
            <TableHead>Avatar</TableHead>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Job Title</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>LinkedIn</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredLeads.map((lead) => (
            <TableRow key={lead.id}>
              <TableCell>
                <Checkbox
                  checked={selectedLeads.includes(lead.id)}
                  onCheckedChange={() => toggleLeadSelection(lead.id)}
                />
              </TableCell>
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

      <div className="flex items-center gap-4 mt-6">
        <Button onClick={handlePrev} disabled={currentCursorIndex === 0}>
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button onClick={handleNext} disabled={!cursor}>
          Next
        </Button>
      </div>

      <Button
        className="self-start mt-4"
        onClick={handleSubmit}
        disabled={selectedLeads.length === 0}
      >
        Submit Selected Leads
      </Button>
    </div>
  );
};

export default LeadTable;
