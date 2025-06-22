import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { XIcon } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

type RangeSelectPairProps = {
  fromName: string;
  toName: string;
  fromOptions: string[];
  toOptions: string[];
  placeholderFrom?: string;
  placeholderTo?: string;
  clearField: (from: string, to?: string) => void;
};

const getFilteredRangeOptions = (
  options: string[],
  bound?: string,
  mode: "min" | "max" = "min"
) => {
  if (!bound) return options;
  const boundNum = Number(bound);
  if (isNaN(boundNum)) return options;

  return options.filter((opt) => {
    const num = Number(opt);
    if (isNaN(num)) return true;
    return mode === "min" ? num > boundNum : num < boundNum;
  });
};

export const RangeSelectPair = ({
  fromName,
  toName,
  fromOptions,
  toOptions,
  placeholderFrom = "From",
  placeholderTo = "To",
  clearField,
}: RangeSelectPairProps) => {
  const form = useFormContext();
  const fromValue = form.watch(fromName);
  const toValue = form.watch(toName);

  const filteredFromOptions = useMemo(
    () => getFilteredRangeOptions(fromOptions, toValue, "max"),
    [fromOptions, toValue]
  );

  const filteredToOptions = useMemo(
    () => getFilteredRangeOptions(toOptions, fromValue, "min"),
    [toOptions, fromValue]
  );

  return (
    <div className="flex flex-col gap-3">
      <FormField
        control={form.control}
        name={fromName}
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormControl>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <SelectTrigger className="flex h-10 w-full items-center justify-between gap-2 px-3">
                  <div className="flex items-center flex-1 overflow-hidden">
                    <SelectValue
                      placeholder={placeholderFrom}
                      className="truncate"
                    />
                  </div>
                  {field.value && (
                    <XIcon
                      className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-destructive"
                      onPointerDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        clearField(fromName, toName);
                      }}
                    />
                  )}
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {filteredFromOptions.map((val) => (
                      <SelectItem value={val} key={val}>
                        {val}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={toName}
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormControl>
              <Select
                key={field.value}
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <SelectTrigger className="flex h-10 w-full items-center justify-between gap-2 px-3">
                  <div className="flex items-center flex-1 overflow-hidden">
                    <SelectValue
                      placeholder={placeholderTo}
                      className="truncate"
                    />
                  </div>
                  {field.value && (
                    <XIcon
                      className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-destructive"
                      onPointerDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        clearField(toName, fromName);
                      }}
                    />
                  )}
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {filteredToOptions.map((val) => (
                      <SelectItem value={val} key={val}>
                        {val}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
