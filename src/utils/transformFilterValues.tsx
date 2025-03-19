// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck

export function transformFilterValues(
  filterValues
): Partial<LeadScenariosFormType> {
  const transformedValues: Partial<LeadScenariosFormType> = {};

  filterValues.forEach(({ filterKey, filterValue }) => {
    if (
      typeof filterValue === "string" ||
      typeof filterValue === "number" ||
      typeof filterValue === "boolean"
    ) {
      transformedValues[filterKey as keyof LeadScenariosFormType] = filterValue;
    } else if (Array.isArray(filterValue)) {
      transformedValues[filterKey as keyof LeadScenariosFormType] = filterValue;
    } else if (typeof filterValue === "object" && filterValue !== null) {
      if ("include" in filterValue || "exclude" in filterValue) {
        transformedValues[
          `${filterKey}_include` as keyof LeadScenariosFormType
        ] = filterValue.include || [];
        transformedValues[
          `${filterKey}_exclude` as keyof LeadScenariosFormType
        ] = filterValue.exclude || [];
      } else if ("from" in filterValue || "to" in filterValue) {
        transformedValues[`${filterKey}_from` as keyof LeadScenariosFormType] =
          filterValue.from || "";
        transformedValues[`${filterKey}_to` as keyof LeadScenariosFormType] =
          filterValue.to || "";
      }
    }
  });

  return transformedValues;
}
