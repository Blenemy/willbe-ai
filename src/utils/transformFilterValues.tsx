// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck

export function transformFilterValues(filterValues) {
  const values = {};

  filterValues.forEach(({ filterKey, filterValue }) => {
    if (Array.isArray(filterValue)) {
      values[filterKey] = filterValue;
    } else if (typeof filterValue === "object") {
      if ("from" in filterValue || "to" in filterValue) {
        values[`${filterKey}_from`] = filterValue.from || "";
        values[`${filterKey}_to`] = filterValue.to || "";
      } else if ("include" in filterValue || "exclude" in filterValue) {
        values[`${filterKey}`] = filterValue.include || [];
        values[`${filterKey}_exclude`] = filterValue.exclude || [];
      }
    } else {
      values[filterKey] = filterValue;
    }
  });

  return values;
}
