// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck

export function transformFilterValues(filterValues) {
  const values = {};

  const textFields = [
    "first_name",
    "last_name",
    "language",
    "job_title",
    "past_job_title",
    "department",
    "school",
    "location",
    "persona",
    "current_company",
    "past_company",
    "company_industry",
    "company_location",
    "keywords",
  ];

  const booleanFields = [
    "posted_on_linkedin",
    "mentioned_in_news",
    "viewed_your_profile",
    "following_your_company",
    "past_colleague",
    "shared_experiences",
    "changed_jobs",
  ];

  const arrayFields = ["seniority", "seniority_exclude", "company_type"];

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

  filterValues.forEach(({ filterKey, filterValue }) => {
    if (textFields.includes(filterKey)) {
      values[filterKey] = filterValue || "";
    } else if (booleanFields.includes(filterKey)) {
      values[filterKey] = Boolean(filterValue);
    } else if (arrayFields.includes(filterKey)) {
      values[filterKey] = Array.isArray(filterValue) ? filterValue : [];
    } else if (rangeFields.some(({ key }) => key === filterKey)) {
      const rangeField = rangeFields.find(({ key }) => key === filterKey);
      if (rangeField) {
        values[rangeField.from] = filterValue.from || "";
        values[rangeField.to] = filterValue.to || "";
      }
    }
  });

  return values;
}
