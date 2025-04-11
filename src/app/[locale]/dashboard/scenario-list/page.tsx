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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, Trash, ChevronDown, ChevronUp, Plus } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SlidersHorizontal } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const columns = [
  { key: "title", label: "Scenario title" },
  { key: "leads", label: "Leads in cadence" },
  { key: "sent", label: "Message sent" },
  { key: "responseRate", label: "Response rate" },
  { key: "meetingRate", label: "Meeting rate" },
  { key: "status", label: "Scenario status" },
  { key: "createdBy", label: "Created by" },
  { key: "createdAt", label: "Created date" },
] as const;

const mockScenarios = [
  {
    id: "1",
    title: "Marketing",
    leads: 48,
    sent: 102,
    responseRate: 28,
    meetingRate: 14,
    status: "in_progress",
    createdBy: "Wade Warren",
    createdAt: "29/3/2025, 17:10",
    avatar: "/avatar1.png",
  },
  {
    id: "2",
    title: "Head of sales",
    leads: 45,
    sent: 85,
    responseRate: 13,
    meetingRate: 10,
    status: "done",
    createdBy: "Jane Cooper",
    createdAt: "29/3/2025, 17:10",
    avatar: "/avatar2.png",
  },
  {
    id: "3",
    title: "Bancos España",
    leads: 57,
    sent: 80,
    responseRate: 53,
    meetingRate: 25,
    status: "in_progress",
    createdBy: "Kathryn Murphy",
    createdAt: "29/3/2025, 17:10",
    avatar: "/avatar3.png",
  },
  {
    id: "4",
    title: "Sales Development DACH",
    leads: 32,
    sent: 64,
    responseRate: 34,
    meetingRate: 16,
    status: "in_progress",
    createdBy: "Cody Fisher",
    createdAt: "29/3/2025, 17:10",
    avatar: "/avatar4.png",
  },
  {
    id: "5",
    title: "Sales Development LATAM",
    leads: 56,
    sent: 85,
    responseRate: 23,
    meetingRate: 12,
    status: "done",
    createdBy: "Annette Black",
    createdAt: "29/3/2025, 17:10",
    avatar: "/avatar5.png",
  },
  {
    id: "6",
    title: "Head of Sales (Benelux)",
    leads: 74,
    sent: 94,
    responseRate: 52,
    meetingRate: 21,
    status: "done",
    createdBy: "Jerome Bell",
    createdAt: "29/3/2025, 17:10",
    avatar: "/avatar6.png",
  },
  {
    id: "7",
    title: "Directores IT Bancos",
    leads: 93,
    sent: 153,
    responseRate: 24,
    meetingRate: 9,
    status: "in_progress",
    createdBy: "Cameron Williamson",
    createdAt: "29/3/2025, 17:10",
    avatar: "/avatar7.png",
  },
  {
    id: "8",
    title: "Compliance Mexico",
    leads: 45,
    sent: 63,
    responseRate: 43,
    meetingRate: 20,
    status: "not_started",
    createdBy: "Dianne Russell",
    createdAt: "29/3/2025, 17:10",
    avatar: "/avatar8.png",
  },
  {
    id: "9",
    title: "PME France",
    leads: 62,
    sent: 87,
    responseRate: 13,
    meetingRate: 6,
    status: "in_progress",
    createdBy: "Esther Howard",
    createdAt: "29/3/2025, 17:10",
    avatar: "/avatar9.png",
  },
  {
    id: "10",
    title: "CE Consulting",
    leads: 32,
    sent: 46,
    responseRate: 45,
    meetingRate: 17,
    status: "not_started",
    createdBy: "Arlene McCoy",
    createdAt: "29/3/2025, 17:10",
    avatar: "/avatar10.png",
  },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "not_started", label: "Not started" },
  { value: "in_progress", label: "In progress" },
  { value: "done", label: "Done" },
];

const STATUS_STYLES = {
  done: "bg-green-100 text-green-700",
  in_progress: "bg-yellow-100 text-yellow-700",
  not_started: "bg-pink-100 text-pink-700",
};

const ScenarioList = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortKey, setSortKey] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [scenarios, setScenarios] = useState(mockScenarios);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [scenarioToDelete, setScenarioToDelete] = useState<string | null>(null);
  const DEFAULT_VISIBLE_COLUMNS = Object.fromEntries(
    columns.map((col) => [col.key, true])
  );

  const [visibleColumns, setVisibleColumns] = useState(DEFAULT_VISIBLE_COLUMNS);

  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const openDeleteDialog = (id: string) => {
    setScenarioToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (scenarioToDelete) {
      setScenarios((prev) => prev.filter((s) => s.id !== scenarioToDelete));
      setIsDeleteDialogOpen(false);
      setScenarioToDelete(null);
    }
  };

  const handleSort = (key: string) => {
    if (sortKey === key) setSortAsc((prev) => !prev);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const filtered = scenarios
    .filter((s) => s.title.toLowerCase().includes(search.toLowerCase()))
    .filter((s) => statusFilter === "all" || s.status === statusFilter)
    .sort((a, b) => {
      if (!sortKey) return 0;
      const valA = a[sortKey as keyof typeof a];
      const valB = b[sortKey as keyof typeof b];
      return sortAsc ? (valA > valB ? 1 : -1) : valA < valB ? 1 : -1;
    });

  return (
    <div className="px-6 py-10 space-y-6 w-full">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Scenario list</h2>
        <div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create scenario
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                View
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {columns.map((col) => (
                <DropdownMenuCheckboxItem
                  key={col.key}
                  checked={visibleColumns[col.key]}
                  onSelect={(e) => {
                    e.preventDefault();
                    toggleColumn(col.key);
                  }}
                >
                  {col.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex justify-between gap-4">
        <Input
          placeholder="Search by Scenario title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Sort by status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Checkbox />
            </TableHead>
            {columns.map(
              (col) =>
                visibleColumns[col.key] && (
                  <TableHead
                    key={col.key}
                    className="cursor-pointer select-none"
                    onClick={() => handleSort(col.key)}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      {sortKey === col.key &&
                        (sortAsc ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        ))}
                    </div>
                  </TableHead>
                )
            )}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.slice(0, rowsPerPage).map((scenario) => (
            <TableRow key={scenario.id}>
              <TableCell>
                <Checkbox />
              </TableCell>
              {visibleColumns.title && <TableCell>{scenario.title}</TableCell>}
              {visibleColumns.leads && <TableCell>{scenario.leads}</TableCell>}
              {visibleColumns.sent && <TableCell>{scenario.sent}</TableCell>}
              {visibleColumns.responseRate && (
                <TableCell>{scenario.responseRate}%</TableCell>
              )}
              {visibleColumns.meetingRate && (
                <TableCell>{scenario.meetingRate}%</TableCell>
              )}
              {visibleColumns.status && (
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      STATUS_STYLES[
                        scenario.status as keyof typeof STATUS_STYLES
                      ]
                    }`}
                  >
                    {
                      STATUS_OPTIONS.find((s) => s.value === scenario.status)
                        ?.label
                    }
                  </span>
                </TableCell>
              )}
              {visibleColumns.createdBy && (
                <TableCell className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={scenario.avatar} />
                    <AvatarFallback>M</AvatarFallback>
                  </Avatar>
                  {scenario.createdBy}
                </TableCell>
              )}
              {visibleColumns.createdAt && (
                <TableCell>{scenario.createdAt}</TableCell>
              )}
              <TableCell className="text-right space-x-2">
                <Button size="icon" variant="ghost">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => openDeleteDialog(scenario.id)}
                >
                  <Trash className="w-4 h-4 text-red-500" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between pt-4">
        <div className="text-sm flex items-center gap-2">
          Rows per page:
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
        <div className="text-sm text-muted-foreground">
          Pagination (add later)
        </div>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete this scenario?
            </DialogTitle>
          </DialogHeader>
          <p>This action cannot be undone.</p>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ScenarioList;
