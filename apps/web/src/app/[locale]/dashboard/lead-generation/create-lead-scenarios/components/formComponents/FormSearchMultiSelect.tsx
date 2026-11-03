"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import { useTranslations } from "next-intl";
import { useSearchParamsQuery } from "@/hooks/useSearchParamsQuery";
import { UseFormReturn } from "react-hook-form";
import { LeadScenariosFormType } from "@/schemas/leadScenariosFiltersSchema";

interface SearchOption {
  id: string;
  title: string;
}

interface FormSearchMultiSelectProps {
  form: UseFormReturn<LeadScenariosFormType>;
  searchName: keyof LeadScenariosFormType;
  selectName: keyof LeadScenariosFormType;
  placeholder: string;
  label: string;
  searchType: string;
  maxCount?: number;
}

const FormSearchMultiSelect = ({
  form,
  searchName,
  selectName,
  placeholder,
  label,
  searchType,
  maxCount = 5,
}: FormSearchMultiSelectProps) => {
  const t = useTranslations("multiSelectWithSearch");

  const searchValue = form.watch(searchName) as string | undefined;
  const selectedOptions = form.watch(selectName) as SearchOption[] | [];

  const {
    data: fetchedOptions = [],
    isLoading,
    refetch,
  } = useSearchParamsQuery(searchType, searchValue || "");

  const handleSearch = () => {
    if (
      !searchValue ||
      typeof searchValue !== "string" ||
      searchValue.trim() === ""
    )
      return;
    refetch();
  };

  const mergedOptions = [
    ...new Map(
      [...selectedOptions, ...fetchedOptions].map((item) => [item.id, item])
    ).values(),
  ];

  return (
    <div className="flex gap-2 flex-col">
      <h4>{label}</h4>
      <div className="flex gap-2">
        <FormField
          control={form.control}
          name={searchName}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input
                  placeholder={placeholder}
                  className="mb-3 pl-3"
                  {...field}
                  value={typeof field.value === "string" ? field.value : ""}
                  onChange={(e) => form.setValue(searchName, e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="button" onClick={handleSearch} disabled={isLoading}>
          {isLoading ? t("searching") : t("search")}
        </Button>
      </div>

      {mergedOptions.length > 0 && (
        <FormField
          control={form.control}
          name={selectName}
          render={() => (
            <FormItem className="flex-1">
              <FormControl>
                <MultiSelect
                  options={mergedOptions.map((item) => ({
                    value: item.id,
                    label: item.title,
                  }))}
                  onValueChange={(selectedIds) => {
                    const selectedObjects = selectedIds.map((id) =>
                      mergedOptions.find((item) => item.id === id)
                    );
                    //@ts-expect-error: safe to assume items exist
                    form.setValue(selectName, selectedObjects);
                  }}
                  defaultValue={selectedOptions.map((item) => item.id)}
                  placeholder={t("selectInclude")}
                  variant="secondary"
                  className="bg-white hover:bg-white pl-0"
                  animation={2}
                  maxCount={maxCount}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};

export default FormSearchMultiSelect;
