/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

export function prepareAccountPayload(values: any, accountName: string) {
  const payload = {
    name: accountName,
    filterValues: [],
  };

  const simpleFields: (keyof any)[] = [
    "network_distance",
    "keywords",
    "has_job_offers",
    "annual_revenue_currency",
    "recent_activities",
  ];

  simpleFields.forEach((key) => {
    if (values[key] && values[key] !== "") {
      payload.filterValues.push({ filterKey: key, filterValue: values[key] });
    }
  });

  const rangeFields = [
    { from: "headcount_from", to: "headcount_to", key: "headcount" },
    {
      from: "headcount_growth_from",
      to: "headcount_growth_to",
      key: "headcount_growth",
    },
    { from: "fortune_from", to: "fortune_to", key: "fortune" },
    {
      from: "followers_count_from",
      to: "followers_count_to",
      key: "followers_count",
    },
    {
      from: "department_headcount_growth_from",
      to: "department_headcount_growth_to",
      key: "department_headcount_growth",
    },
    {
      from: "department_headcount_from",
      to: "department_headcount_to",
      key: "department_headcount",
    },
    {
      from: "annual_revenue_from",
      to: "annual_revenue_to",
      key: "annual_revenue",
    },
  ];

  rangeFields.forEach(({ from, to, key }) => {
    const fromValue = values[from];
    const toValue = values[to];

    if (fromValue !== undefined || toValue !== undefined) {
      payload.filterValues.push({
        filterKey: key,
        filterValue: { 
          from: fromValue !== undefined ? Number(fromValue) : 0, 
          to: toValue !== undefined ? Number(toValue) : 0 
        },
      });
    }
  });

  const includeExcludeFields = [
    {
      include: "industry_include",
      exclude: "industry_exclude",
      key: "industry",
    },
    {
      include: "location_include",
      exclude: "location_exclude",
      key: "location",
    },
    {
      include: "saved_accounts_include",
      exclude: "saved_accounts_exclude",
      key: "saved_accounts",
    },
  ];

  includeExcludeFields.forEach(({ include, exclude, key }) => {
    const includeValues = values[include] as { title: string; id: string }[];
    const excludeValues = values[exclude] as { title: string; id: string }[];

    const filteredInclude = includeValues?.filter(
      (item) => item?.title && item?.id
    ) || [];
    const filteredExclude = excludeValues?.filter(
      (item) => item?.title && item?.id
    ) || [];

    if (filteredInclude.length > 0 || filteredExclude.length > 0) {
      payload.filterValues.push({
        filterKey: key,
        filterValue: {
          include: filteredInclude,
          exclude: filteredExclude,
        },
      });
    }
  });

  if (Array.isArray(values.technology) && values.technology.length > 0) {
    const cleanTech = values.technology.filter(
      (item: any) => item?.title && item?.id
    );
    if (cleanTech.length > 0) {
      payload.filterValues.push({
        filterKey: "technology",
        filterValue: cleanTech,
      });
    }
  }

  return payload;
}
