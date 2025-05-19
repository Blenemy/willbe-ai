"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { CustomPagination } from "@/components/CustomPagination/CustomPagination";

const meetings = [
  {
    name: "Savannah Nguyen",
    position: "Head of Marketing",
    account: "BrightWorks Inc.",
    avatar: "/avatars/savannah.jpg",
  },
  {
    name: "Darrell Steward",
    position: "CTO",
    account: "NextGen Solutions",
    avatar: "/avatars/darrell.jpg",
  },
  {
    name: "Ralph Edwards",
    position: "VP of Sales",
    account: "Horizon Media",
    avatar: "/avatars/ralph.jpg",
  },
  {
    name: "Darlene Robertson",
    position: "Marketing Specialist",
    account: "Cloudify",
    avatar: "/avatars/darlene.jpg",
  },
  {
    name: "Eleanor Pena",
    position: "Business Developer",
    account: "Apex Technologies",
    avatar: "/avatars/eleanor.jpg",
  },
  {
    name: "Marvin McKinney",
    position: "Marketing Specialist",
    account: "Horizon Media Group",
    avatar: "/avatars/marvin.jpg",
  },
  {
    name: "Jacob Jones",
    position: "CTO",
    account: "Apex",
    avatar: "/avatars/jacob.jpg",
  },
];

export default function MeetingsList() {
  return (
    <div className="border overflow-hidden bg-white h-full flex flex-col rounded-2xl">
      <div className="px-6 py-6">
        <div className="text-lg font-semibold">Meetings (15)</div>
        <p className="text-sm text-muted-foreground">In the last month</p>
      </div>
      <Table className="flex-grow">
        <TableHeader>
          <TableRow>
            <TableHead>Lead name</TableHead>
            <TableHead>Position</TableHead>
            <TableHead className="text-right">Account name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {meetings.map((m, i) => (
            <TableRow key={i} className="h-16">
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={m.avatar} alt={m.name} />
                    <AvatarFallback>{m.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="truncate font-medium text-sm">{m.name}</span>
                </div>
              </TableCell>
              <TableCell className="truncate text-sm text-muted-foreground">
                {m.position}
              </TableCell>
              <TableCell className="text-right text-sm font-medium truncate">
                <div className="flex justify-end items-center gap-1">
                  <span>{m.account}</span>
                  <Button size="icon" variant="ghost" className="h-5 w-5 p-0">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="w-full flex mt-auto p-6">
        <div className="mx-auto">
          <CustomPagination
            page={0}
            setPage={() => {}}
            rowsPerPage={6}
            totalCount={meetings.length}
          />
        </div>
      </div>
    </div>
  );
}
