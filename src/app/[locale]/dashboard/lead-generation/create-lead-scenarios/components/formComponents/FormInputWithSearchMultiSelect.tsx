import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { MultiSelect } from "@/components/ui/multi-select";
import { useSearchParamsQuery } from "@/hooks/useSearchParamsQuery";
import { LeadScenariosFormType } from "../../page";

interface SearchOption {
  id: string;
  title: string;
}

interface FormInputWithSearchMultiSelectProps {
  form: UseFormReturn<LeadScenariosFormType>;
  includeName: keyof LeadScenariosFormType;
  excludeName: keyof LeadScenariosFormType;
  searchName: keyof LeadScenariosFormType;
  placeholder: string;
  label: string;
  searchType: string;
}

const FormInputWithSearchMultiSelect = ({
  form,
  includeName,
  excludeName,
  searchName,
  placeholder,
  label,
  searchType,
}: FormInputWithSearchMultiSelectProps) => {
  const keywords = form.watch(searchName) as string | undefined;
  const includeOptions = form.watch(includeName) as SearchOption[] | [];
  const excludeOptions = form.watch(excludeName) as SearchOption[] | [];

  const {
    data: fetchedOptions = [],
    isLoading,
    refetch,
  } = useSearchParamsQuery(searchType, keywords || "");

  const handleSearch = () => {
    if (!keywords || typeof keywords !== "string" || keywords.trim() === "")
      return;
    refetch();
  };

  // 🔥 Объединяем данные с бэка и сохраненные значения
  const mergedOptions = [
    ...new Map(
      [...includeOptions, ...excludeOptions, ...fetchedOptions].map((item) => [
        item.id,
        item,
      ])
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
                  className="mb-3"
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
          {isLoading ? "Searching..." : "Search"}
        </Button>
      </div>

      {mergedOptions.length > 0 && (
        <>
          <FormField
            control={form.control}
            name={includeName}
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
                      //@ts-expect-error selectedObjects cannot recieve undefined
                      form.setValue(includeName, selectedObjects);
                    }}
                    defaultValue={includeOptions.map((item) => item.id)}
                    placeholder="Select values to include"
                    variant="secondary"
                    className="bg-white hover:bg-white"
                    animation={2}
                    maxCount={5}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={excludeName}
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
                      //@ts-expect-error selectedObjects cannot recieve undefined
                      form.setValue(excludeName, selectedObjects);
                    }}
                    defaultValue={excludeOptions.map((item) => item.id)}
                    placeholder="Select values to exclude"
                    variant="secondary"
                    className="bg-white hover:bg-white"
                    animation={2}
                    maxCount={5}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}
    </div>
  );
};

export default FormInputWithSearchMultiSelect;
