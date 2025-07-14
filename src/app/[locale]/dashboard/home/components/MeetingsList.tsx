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
import { useEffect, useMemo, useState } from "react";
import { useMeetings } from "@/hooks/useHomepage";
import { useToggleDaysInterval } from "@/hooks/useToggleDaysInterval";
import { handleAxiosError } from "@/utils/handleAxiosError/handleAxiosError";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { v4 as uuidv4 } from "uuid";

const ROWS_PER_PAGE = 7;

export default function MeetingsList() {
  const [page, setPage] = useState(0);
  const offset = page * ROWS_PER_PAGE;

  const { daysInterval, toggleInterval, subtitleText } =
    useToggleDaysInterval();

  const {
    meetings = [],
    error,
    isLoading,
  } = useMeetings({
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

  const currentMeetings = meetings.slice(offset, offset + ROWS_PER_PAGE);

  const skeletonKeys = useMemo(
    () => Array.from({ length: ROWS_PER_PAGE }, () => uuidv4()),
    []
  );

  return (
    <Card className="border overflow-hidden bg-white h-full flex flex-col rounded-2xl">
      <CardHeader className="flex justify-between flex-row">
        <div className="flex flex-col gap-2">
          <CardTitle>Meetings ({meetings.length})</CardTitle>
          <p className="text-sm text-muted-foreground">{subtitleText}</p>
        </div>
        <div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={toggleInterval}
          >
            <CalendarDays className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      {isLoading && (
        <Table className="flex-grow">
          <TableHeader>
            <TableRow>
              <TableHead>Lead name</TableHead>
              <TableHead>Position</TableHead>
              <TableHead className="text-right">Account name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {skeletonKeys.map((key) => (
              <TableRow key={key} className="h-16">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-[120px] rounded-md" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[100px] rounded-md" />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end items-center gap-2">
                    <Skeleton className="h-4 w-[140px] rounded-md" />
                    <Skeleton className="h-5 w-5 rounded-md" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {!isLoading && meetings.length > 0 && (
        <Table className="flex-grow">
          <TableHeader>
            <TableRow>
              <TableHead>Lead name</TableHead>
              <TableHead>Position</TableHead>
              <TableHead className="text-right">Account name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentMeetings.map((m) => (
              <TableRow key={m.messageScenarioId} className="h-16">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={m.leadProfilePictureUrl}
                        alt={m.leadName}
                      />
                      <AvatarFallback>{m.leadName[0]}</AvatarFallback>
                    </Avatar>
                    <span className="truncate font-medium text-sm">
                      {m.leadName}
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
      )}

      {!isLoading && meetings.length === 0 && (
        <div className="h-[350px] flex flex-col items-center justify-center text-center py-12 text-muted-foreground">
          <CalendarDays className="w-10 h-10 mb-4" />
          <p className="text-lg font-medium mb-1">No meetings found</p>
          <p className="text-sm max-w-sm">
            Try changing the date range or come back later when new meetings
            appear.
          </p>
        </div>
      )}

      {meetings.length > 0 && !isLoading && (
        <div className="w-full flex mt-auto p-6">
          <div className="mx-auto">
            <CustomPagination
              page={page}
              setPage={setPage}
              rowsPerPage={ROWS_PER_PAGE}
              totalCount={meetings.length}
            />
          </div>
        </div>
      )}
    </Card>
  );
}
