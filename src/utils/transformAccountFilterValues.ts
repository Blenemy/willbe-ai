// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck

export function transformAccountFilterValues(
  filterValues
): Partial<AccountScenariosFormType> {
  const transformedValues: Partial<AccountScenariosFormType> = {};

  filterValues.forEach(({ filterKey, filterValue }) => {
    if (
      typeof filterValue === "string" ||
      typeof filterValue === "number" ||
      typeof filterValue === "boolean"
    ) {
      transformedValues[filterKey as keyof AccountScenariosFormType] =
        filterValue;
    } else if (Array.isArray(filterValue)) {
      transformedValues[filterKey as keyof AccountScenariosFormType] =
        filterValue;
    } else if (typeof filterValue === "object" && filterValue !== null) {
      if ("include" in filterValue || "exclude" in filterValue) {
        transformedValues[
          `${filterKey}_include` as keyof AccountScenariosFormType
        ] = filterValue.include || [];
        transformedValues[
          `${filterKey}_exclude` as keyof AccountScenariosFormType
        ] = filterValue.exclude || [];
      } else if ("from" in filterValue || "to" in filterValue) {
        transformedValues[
          `${filterKey}_from` as keyof AccountScenariosFormType
        ] = filterValue.from || "";
        transformedValues[`${filterKey}_to` as keyof AccountScenariosFormType] =
          filterValue.to || "";
      } else if ("title" in filterValue && "value" in filterValue) {
        transformedValues[filterKey as keyof AccountScenariosFormType] =
          filterValue.value || "";
      }
    }
  });

  return transformedValues;
}
