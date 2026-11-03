/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

export function preparePayload(
  values: any,
  scenarioId: string,
  scenarioName: string
) {
  const payload = {
    leadScenarioId: scenarioId,
    filterValues: [],
  };

  if (scenarioName) {
    payload.name = scenarioName;
  }

  const simpleFields: (keyof any)[] = [
    "first_name",
    "last_name",
    "language",
    "company_location",
    "network_distance",
    "keywords",
    "posted_on_linkedin",
    "mentioned_in_news",
    "viewed_your_profile",
    "following_your_company",
    "past_colleague",
    "shared_experiences",
    "changed_jobs",
  ];

  simpleFields.forEach((key) => {
    if (values[key]) {
      payload.filterValues.push({ filterKey: key, filterValue: values[key] });
    }
  });

  const rangeFields = [
    { from: "job_tenure_from", to: "job_tenure_to", key: "job_tenure" },
    {
      from: "experience_years_from",
      to: "experience_years_to",
      key: "experience_years",
    },
    {
      from: "company_headcount_from",
      to: "company_headcount_to",
      key: "company_headcount",
    },
    {
      from: "company_tenure_from",
      to: "company_tenure_to",
      key: "company_tenure",
    },
  ];

  rangeFields.forEach(({ from, to, key }) => {
    if (values[from] || values[to]) {
      payload.filterValues.push({
        filterKey: key,
        filterValue: { from: values[from] || "0", to: values[to] || "0" },
      });
    }
  });

  const includeExcludeFields = [
    {
      include: "job_title_include",
      exclude: "job_title_exclude",
      key: "job_title",
    },
    {
      include: "past_job_title_include",
      exclude: "past_job_title_exclude",
      key: "past_job_title",
    },
    {
      include: "current_company_include",
      exclude: "current_company_exclude",
      key: "current_company",
    },
    {
      include: "department_include",
      exclude: "department_exclude",
      key: "department",
    },
    {
      include: "company_location_include",
      exclude: "company_location_exclude",
      key: "company_location",
    },
    {
      include: "company_industry_include",
      exclude: "company_industry_exclude",
      key: "company_industry",
    },
    {
      include: "past_company_include",
      exclude: "past_company_exclude",
      key: "past_company",
    },
    { include: "school_include", exclude: "school_exclude", key: "school" },
    {
      include: "seniority_include",
      exclude: "seniority_exclude",
      key: "seniority",
    },
    {
      include: "location_include",
      exclude: "location_exclude",
      key: "location",
    },
  ];

  includeExcludeFields.forEach(({ include, exclude, key }) => {
    const includeValues = values[include] as { title: string; id: string }[];
    const excludeValues = values[exclude] as { title: string; id: string }[];

    if (
      key === "seniority" &&
      (includeValues.length > 0 || excludeValues.length > 0)
    ) {
      payload.filterValues.push({
        filterKey: key,
        filterValue: {
          include: includeValues || [],
          exclude: excludeValues || [],
        },
      });

      return;
    }

    const filteredInclude = includeValues?.filter(
      (item) => item?.title && item?.id
    );
    const filteredExclude = excludeValues?.filter(
      (item) => item?.title && item?.id
    );

    if (filteredInclude.length > 0 || filteredExclude.length > 0) {
      payload.filterValues.push({
        filterKey: key,
        filterValue: {
          include: filteredInclude || [],
          exclude: filteredExclude || [],
        },
      });
    }
  });

  const arrayFields = ["company_type"];

  arrayFields.forEach((key) => {
    if (values[key] && Array.isArray(values[key]) && values[key].length > 0) {
      payload.filterValues.push({
        filterKey: key.replace("_include", "").replace("_exclude", ""),
        filterValue: values[key],
      });
    }
  });

  const objectArrayFields = ["persona"];

  objectArrayFields.forEach((key) => {
    const items = values[key] as { id: string; title: string }[];

    const filtered = items?.filter((item) => item?.id && item?.title) ?? [];

    if (filtered.length > 0) {
      payload.filterValues.push({
        filterKey: key,
        filterValue: filtered,
      });
    }
  });

  return payload;
}
