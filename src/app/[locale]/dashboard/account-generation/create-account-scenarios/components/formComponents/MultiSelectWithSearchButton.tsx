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
import { AccountScenariosType } from "../../page";

interface SearchOption {
  id: string;
  title: string;
}

interface FormInputWithSearchMultiSelectProps {
  form: UseFormReturn<AccountScenariosType>;
  includeName?: keyof AccountScenariosType;
  excludeName?: keyof AccountScenariosType;
  searchName: keyof AccountScenariosType;
  valueName?: keyof AccountScenariosType;
  placeholder: string;
  label: string;
  searchType: string;
  isSingleSelect?: boolean;
}

const MultiSelectWithSearchButton = ({
  form,
  includeName,
  excludeName,
  searchName,
  placeholder,
  label,
  searchType,
  isSingleSelect = false,
  valueName,
}: FormInputWithSearchMultiSelectProps) => {
  const keywords = form.watch(searchName) as string | undefined;

  const includeOptions = includeName
    ? (form.watch(includeName) as SearchOption[] | [])
    : [];

  const excludeOptions = excludeName
    ? (form.watch(excludeName) as SearchOption[] | [])
    : [];

  const selectedItems = valueName
    ? (form.watch(valueName) as SearchOption[] | [])
    : [];

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

  const mergedOptions = [
    ...new Map(
      [
        ...includeOptions,
        ...excludeOptions,
        ...fetchedOptions,
        ...selectedItems,
      ].map((item) => [item.id, item])
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
          {isSingleSelect && (
            <FormField
              control={form.control}
              name={searchName}
              render={() => (
                <FormItem className="flex-1">
                  <FormControl>
                    <MultiSelect
                      options={mergedOptions.map((item) => ({
                        value: item.id,
                        label: item.title,
                      }))}
                      onValueChange={(selectedIds) => {
                        const selectedObjects = selectedIds
                          .map((id) =>
                            mergedOptions.find((item) => item.id === id)
                          )
                          .filter(Boolean);
                        if (valueName) {
                          form.setValue(
                            valueName,
                            selectedObjects as SearchOption[]
                          );
                        }
                      }}
                      defaultValue={selectedItems.map((item) => item.id)}
                      placeholder="Select technologies"
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
          )}
          {includeName && (
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
          )}

          {excludeName && (
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
          )}
        </>
      )}
    </div>
  );
};

export default MultiSelectWithSearchButton;
