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
import { CalendarDays, ExternalLink } from "lucide-react";
import { CustomPagination } from "@/components/CustomPagination/CustomPagination";
import { useEffect, useState } from "react";
import { useMeetings } from "@/hooks/useHomepage";
import { useToggleDaysInterval } from "@/hooks/useToggleDaysInterval";
import { handleAxiosError } from "@/utils/handleAxiosError/handleAxiosError";

const ROWS_PER_PAGE = 7;

export default function MeetingsList() {
  const [page, setPage] = useState(0);
  const offset = page * ROWS_PER_PAGE;

  const { daysInterval, toggleInterval, subtitleText } =
    useToggleDaysInterval();

  const { meetings = [], error } = useMeetings({
    enableFetch: true,
    daysInterval,
    limit: ROWS_PER_PAGE,
    offset,
  });

  useEffect(() => {
    if (error) {
      handleAxiosError(error, "Failed to load meetings");
    }
  }, [error]);

  return (
    <div className="border overflow-hidden bg-white h-full flex flex-col rounded-2xl">
      <div className="px-6 py-6">
        <div className="flex justify-between">
          <div className="flex flex-col gap-2">
            <div className="text-lg font-semibold">
              Meetings ({meetings.length})
            </div>
            <p className="text-sm text-muted-foreground">{subtitleText}</p>
          </div>

          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 mt-1"
            onClick={toggleInterval}
          >
            <CalendarDays className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {meetings.length > 0 ? (
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
                      <AvatarImage
                        src={m.leadProfilePictureUrl}
                        alt={m.accountName}
                      />
                      <AvatarFallback>{m.accountName[0]}</AvatarFallback>
                    </Avatar>
                    <span className="truncate font-medium text-sm">
                      {m.accountName}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="truncate text-sm text-muted-foreground">
                  {m.position}
                </TableCell>
                <TableCell className="text-right text-sm font-medium truncate">
                  <div className="flex justify-end items-center gap-1">
                    <span>{m.accountUrl}</span>
                    <Button size="icon" variant="ghost" className="h-5 w-5 p-0">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="px-6">No mettings were found</div>
      )}

      {meetings.length > 0 && (
        <div className="w-full flex mt-auto p-6">
          <div className="mx-auto">
            <CustomPagination
              page={0}
              setPage={setPage}
              rowsPerPage={ROWS_PER_PAGE}
              totalCount={meetings.length}
            />
          </div>
        </div>
      )}
    </div>
  );
}
