"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAutoEnrichSetting } from "@/hooks/useAutoEnrichSetting";
import { ArrowRight } from "lucide-react";
import { Label } from "@/components/ui/label";

interface Props {
  defaultValue: boolean;
}

export const AutoEnrichSelect = ({ defaultValue }: Props) => {
  const [value, setValue] = useState<string | undefined>("no");
  const { updateAutoEnrich, isPending } = useAutoEnrichSetting();

  const handleChange = (newValue: string) => {
    setValue(newValue);
    updateAutoEnrich({
      isAutoSync: newValue === "yes",
    });
  };

  useEffect(() => {
    setValue(defaultValue === true ? "yes" : "no");
  }, [defaultValue]);

  return (
    <div className="flex flex-col gap-2 mb-5">
      <div className="text-2xl font-semibold mb-5 flex flex-col gap-3">
        <div className="flex gap-2">
          <h2>HubSpot Data Overwrite Settings</h2>
        </div>

        <p className="text-[#5F5F5F] mb-6 text-sm font-normal">
          Choosing data enrichment, some of the information that you have for
          these accounts in Hubspot may be overwritten with the freshest
          information about these accounts.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Label className="w-56 text-sm text-foreground">Auto enrich</Label>
        <ArrowRight className="w-4 h-4 text-muted-foreground" />
        <Select onValueChange={handleChange} value={value}>
          <SelectTrigger className="w-full" disabled={isPending}>
            <SelectValue placeholder="Choose an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yes">Yes</SelectItem>
            <SelectItem value="no">No</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
