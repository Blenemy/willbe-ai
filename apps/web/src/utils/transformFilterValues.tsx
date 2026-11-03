/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import { LeadScenariosFormType } from "@/schemas/leadScenariosFiltersSchema";

type FilterEntry = {
  filterKey: string;
  filterValue: any;
};

export function transformFilterValues(
  filterValues: FilterEntry[]
): Partial<LeadScenariosFormType> {
  const transformedValues: Partial<LeadScenariosFormType> = {};

  filterValues.forEach(({ filterKey, filterValue }) => {
    if (isPrimitive(filterValue)) {
      transformedValues[filterKey as keyof LeadScenariosFormType] =
        typeof filterValue === "number" ? filterValue.toString() : filterValue;
      return;
    }

    if (Array.isArray(filterValue)) {
      transformedValues[filterKey as keyof LeadScenariosFormType] = filterValue;
      return;
    }

    if (isIncludeExclude(filterValue)) {
      transformedValues[`${filterKey}_include` as keyof LeadScenariosFormType] =
        filterValue.include || [];
      transformedValues[`${filterKey}_exclude` as keyof LeadScenariosFormType] =
        filterValue.exclude || [];
      return;
    }

    if (isFromTo(filterValue)) {
      transformedValues[`${filterKey}_from` as keyof LeadScenariosFormType] =
        toStringOrEmpty(filterValue.from);
      transformedValues[`${filterKey}_to` as keyof LeadScenariosFormType] =
        toStringOrEmpty(filterValue.to);
    }
  });

  return transformedValues;
}

function isPrimitive(value: any): value is string | number | boolean {
  return (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  );
}

function isIncludeExclude(
  value: any
): value is { include?: any[]; exclude?: any[] } {
  return value && (value.include !== undefined || value.exclude !== undefined);
}

function isFromTo(value: any): value is { from?: any; to?: any } {
  return value && (value.from !== undefined || value.to !== undefined);
}

function toStringOrEmpty(val: any): string {
  return val !== undefined && val !== null ? val.toString() : "";
}
