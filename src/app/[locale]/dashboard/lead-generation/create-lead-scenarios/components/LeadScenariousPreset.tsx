"use client";

import { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Save, Trash, Upload, RefreshCw } from "lucide-react";
import { Users } from "lucide-react";
import { useLeadFilters } from "@/hooks/useLeadFilters";
import { LeadScenarios } from "@/types/LeadScenarios";

const LeadScenariousPresets = ({
  setNewPreset,
  newPreset,
  handleLoadFilter,
  setActiveStep,
}: {
  setNewPreset: Dispatch<SetStateAction<string>>;
  newPreset: string;
  handleLoadFilter: (id: string, flag: boolean) => void;
  setActiveStep: Dispatch<SetStateAction<number>>;
  leadScenarioById: LeadScenarios | undefined;
}) => {
  const { leadFiltersTableData, deleteLeadFilter } = useLeadFilters({
    enableFetch: true,
  });

  const handleDeleteFilter = (id: string) => {
    deleteLeadFilter({ id });
  };

  return (
    <div className="w-full px-6 py-10 flex flex-col">
      <h2 className="mb-5 font-semibold text-2xl">
        Save/select lead scenario filters
      </h2>

      <div className="flex gap-3 mb-4">
        <Input
          placeholder="Include scenario filter name..."
          value={newPreset}
          onChange={(e) => setNewPreset(e.target.value)}
          className="w-full"
        />
        <Button className="flex items-center gap-2" type="submit">
          <Save size={16} /> Save
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Scenario filter name</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leadFiltersTableData
            ?.filter((preset) => preset.name)
            .map((preset) => (
              <TableRow key={preset.id}>
                <TableCell>{preset.name}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={() => handleLoadFilter(preset.id, true)}
                  >
                    <Upload size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={() => handleLoadFilter(preset.id, false)}
                  >
                    <RefreshCw size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={() => handleDeleteFilter(preset.id)}
                  >
                    <Trash size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <div className="flex justify-center gap-4 mt-6">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          type="button"
          onClick={() => setActiveStep((prev) => prev + 1)}
        >
          <Users size={16} /> Search leads
        </Button>
      </div>
    </div>
  );
};

export default LeadScenariousPresets;
